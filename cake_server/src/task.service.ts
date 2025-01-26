import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category,Good ,Brand} from './entities';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateBrandData() {
    const brands = [
      { name: 'WentingG', appId: 'wx50d13a67c1b59969', kdtId: '177397716' },
      { name: 'DeLuoXin', appId: 'wx50d13a67c1b59969', kdtId: '177397716' }
    ];

    for (const brand of brands) {
      try {
        const shelfConfig = await this.fetchYouzanShelfConfig(brand.appId, brand.kdtId);
        const goods = await this.fetchYouzanGoodsList(brand.appId, brand.kdtId, shelfConfig);

        const brandEntity = this.brandRepository.create({
          name: brand.name,
          appId: brand.appId,
          kdtId: brand.kdtId,
          itemGroups: shelfConfig.data.shelf.itemGroupList,
          shelfConfig: shelfConfig.data.shelf,
          originalJson: shelfConfig,
        });

        await this.brandRepository.save(brandEntity);
        this.logger.log(`Updated data for brand: ${brand.name}`);

        await this.saveCategoriesAndGoods(goods, shelfConfig);
        await this.cacheManager.set(`brand_${brand.name}_goods`, goods, 3600 );
      } catch (error) {
        this.logger.error(`Error updating brand ${brand.name}`, error);
      }
    }
  }

  async fetchYouzanShelfConfig(appId: string, kdtId: string) {
    try {
      const response = await axios.post(
        'https://h5.youzan.com/retail/h5/miniprogram/shelf-config/getFirstLevelConfigs',
        {
          goodsFilterType: 0,
          alias: 'uUKBWb5BUZ',
          mode: '1',
          userLocation: {},
          retailSource: 'MINAPP-SHELF-3.41.5',
          useSwitch: 'v2',
          supportUnavailableGoods: 2,
          supportFixGroupOptionalCombo: true,
          screenWidth: 414,
        },
        {
          params: { app_id: appId, kdt_id: kdtId },
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'h5.youzan.com',
            'Connection': 'keep-alive',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Youzan shelf config', error);
      throw error;
    }
  }

  async fetchYouzanGoodsList(appId: string, kdtId: string, shelfConfig: any) {
    try {
      const response = await axios.post(
        'https://h5.youzan.com/retail/h5/miniprogram/goods/goodsListByTagAlias.json',
        {
          pickUpWay: "SELF_TAKE",
          location: {
            lat: 31.255320035764452,
            lng: 121.38502253750968
          },
          goodsFilterType: 0,
          group: shelfConfig.data.shelf.itemGroupList[0],
          activityPriceIndependent: 1,
          deliveryTypes: [1],
          supportCombo: 1,
          retailSource: "MINAPP-SHELF-3.41.5",
          excludedComboSubType: ["none"],
          needDeliveryTime: false,
          skipUmp: true,
          needItemProp: true,
          supportUnavailableGoods: 2,
          supportFixGroupOptionalCombo: true
        },
        {
          params: { app_id: appId, kdt_id: kdtId },
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'h5.youzan.com',
            'Connection': 'keep-alive',
          },
        }
      );

      return response.data.data.list;
    } catch (error) {
      this.logger.error('Error fetching Youzan goods list', error);
      throw error;
    }
  }

  async saveCategoriesAndGoods(goods: any[], shelfConfig: any) {
    const categories = shelfConfig.data.shelf.itemGroupList.map(group => ({
      name: group.groupTitle,
      imageUrl: group.icon,
      url: null,
      originalJson: group,
    }));

    await this.categoryRepository.save(categories);
    this.logger.log(`Saved categories: ${categories.map(c => c.name).join(', ')}`);

    const goodEntities = goods.map(good => ({
      name: good.title,
      description: good.sellPoint,
      imageUrl: good.imageUrl,
      price: good.price / 100,  // Assuming price is in cents
      url: null,
      originalJson: good,
    }));

    await this.goodRepository.save(goodEntities);
    this.logger.log(`Saved goods: ${goodEntities.map(g => g.name).join(', ')}`);
  }
}