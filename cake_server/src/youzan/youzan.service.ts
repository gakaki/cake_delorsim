import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Category,Good,Brand } from '../entities';
import { YouzanFirstLevelConfig } from '@/entities/dto/youzanFirstLevelConfig.dto';
import { YouzanGood } from '@/entities/dto/youzanGood.dto';

// export interface YouZanShelfConfig {
//   itemGroupList: Array<{
//     groupId: number;
//     title: string;
//     icon?: string;
//     customSortGoods?: Array<{ id: number; sort: number }>;
//   }>;
// }

@Injectable()
export class YouZanService {
  private readonly logger = new Logger(YouZanService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Good)
    private goodRepository: Repository<Good>
  ) {}
  
  async sync() {
    let brands = await this.brandRepository.find();
    if (brands.length === 0) {
      brands = await this.initBrands()
    }
    for (const brand of brands) {
      await this.fetchFirstLevelConfig(brand);
    }

    // Find categories with brand and goods, ordered by creation time
    const categories = await this.categoryRepository.find({
      relations: {
        brand: true,
        goods: true
      },
      order: {
        createdAt: 'DESC'
      },
      take: 400  // Limit to prevent overwhelming response
    });

    // Transform categories to include more details
    return categories.map(category => ({
      ...category,
      brandName: category.brand?.name || 'Unknown',
      goodsCount: category.goods?.length || 0,
      goodsSummary: category.goods?.map(good => ({
        id: good.id,
        name: good.name,
        price: good.price,
        imageUrl: good.imageUrl
      })) || []
    }));
  }

  async initBrands() : Promise<Brand[]> {
    const initialBrands = [
      {
        name: 'WentingG 文汀半糖蛋糕',
        appId: 'wx2e2e28945c980c46', 
        kdtId: '146387302',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '德罗心', 
        appId: 'wx50d13a67c1b59969', 
        kdtId: '177397716',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const res = await this.brandRepository.save(initialBrands);
    this.logger.log(`Initialized ${initialBrands.length} brands`);
    return res
  }

  async fetchFirstLevelConfig(brand: Brand): Promise<void> {
    this.logger.log(`开始同步:${brand.name} , ${brand.appId}, ${brand.kdtId}`);

    let postBody = {
      "goodsFilterType": 0,
      "alias": "",
      "mode": "0",
      "userLocation": {},
      "retailSource": "MINAPP-SHELF-3.41.5",
      "useSwitch": "v2",
      "supportUnavailableGoods": 2,
      "supportFixGroupOptionalCombo": true,
      "screenWidth": 414
    }
    if (brand.name == '德罗心'){
      postBody.alias =  "uUKBWb5BUZ";
      postBody.mode =  "1";
    }
    
    await firstValueFrom(
      this.httpService.post(`https://h5.youzan.com/retail/h5/miniprogram/shelf-config/getFirstLevelConfigs`,postBody , {
        params: {
          app_id: brand.appId,
          kdt_id: brand.kdtId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(async(error: AxiosError) =>  {
        
          if (error.response?.status === 401 && !error.response?.data) {
            this.logger.warn(`401 error for brand ${brand.name}, returning null`);
            return null;
          }
        
          if (error.response?.status == 401 && error.response?.data) {
            const responseData = error.response.data as { data?: YouzanFirstLevelConfig };
            const youzanFirstLevelConfig = responseData.data;

            if (!youzanFirstLevelConfig) {
              this.logger.warn(`No data found in 401 response for brand ${brand.name}`);
              return null;
            }
            const categories = youzanFirstLevelConfig.shelf?.groups?.selfFetch || [];
            this.logger.log(`brand ${brand.name} Rows: ${categories.length} `);

            for (const categoryData of categories) {
              const categoryRes = await this.categoryRepository.upsert({
                id: categoryData.groupId,
                name: categoryData.title,
                imageUrl: categoryData.icon,
                json: JSON.parse(JSON.stringify(categoryData)),  // Deep clone to ensure JSON compatibility
                brand: brand,  // Set the brand relationship
                createdAt: new Date(),
                updatedAt: new Date()
              }, ['id']);

            
              this.logger.log(`Saved category: ${categoryData.title}`);

              const categoryRow = await this.categoryRepository.findOne({
                where : {
                  id: categoryRes.identifiers[0].id
                },
                relations: {
                  brand: true
                },
              });
              if (categoryRow){
                await this.syncGoods(categoryRow);
              }else{
                this.logger.error(`没有找到对应的category 行 ${categoryData.title}`);
              }
            }
            this.logger.log(`结束同步  ${brand.name}`);
          }
        }),
      ),
    );
  }

  async syncGoods(category:Category) {
    
    const url = `https://h5.youzan.com/retail/h5/miniprogram/goods/goodsListByTagAlias.json`;
    const requestBody = {
      group: category.json,
    };
    await firstValueFrom(
      this.httpService.post(url, requestBody, {
        params: {
          app_id: category.brand?.appId,
          kdt_id: category.brand?.kdtId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(async(error: AxiosError) => {
          this.logger.error(`Youzan API Error: ${error.message}`, error.stack);
          
          if (error.response?.status === 401 && !error.response?.data) {
            this.logger.warn(`401 error for brand ${category.brand?.name}, returning null`);
            return null;
          }
          
          if (error.response?.status == 401 && error.response?.data) {
            const responseData = error.response.data as { data?: YouzanGood[] };
            const youzanGoods = responseData.data;
            console.log(responseData)
            const brandAndCategory = `brand: ${category.brand?.name} - ${category.name}`
            if (!youzanGoods) {
              this.logger.warn(`No data found in 401 response for ${brandAndCategory}`);
              this.logger.warn(requestBody);
              return null;
            }
            this.logger.log(`${brandAndCategory} Rows: ${youzanGoods.length} `);

            for (const good of youzanGoods) {
              const goodRes = await this.goodRepository.upsert({
                id: good.id,
                name: good.title,
                description: good.sellPoint,
                imageUrl: good.imageUrl,
                price: good.price / 100,  // Convert cents to dollars
                category: category,
                brand: category.brand,
                json: JSON.parse(JSON.stringify(good)),  // Deep clone to ensure JSON compatibility
                createdAt: new Date(),
                updatedAt: new Date()
              }, ['id']);
              
              this.logger.log(`Saved ${brandAndCategory}: ${good.title}`);
            }
            this.logger.log(`结束同步  ${brandAndCategory} `);
          }
          
        }),
      ),
    );
  }
}