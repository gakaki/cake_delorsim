import { 
    ClassSerializerInterceptor, 
    Controller, 
    Get, 
    Query, 
    UseInterceptors, 
    DefaultValuePipe, 
    ParseIntPipe, 
    ParseArrayPipe 
} from '@nestjs/common';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Good } from '../entities/good.entity';
import { GoodService } from './good.service';

@Controller('goods')
// @UseInterceptors(CacheInterceptor)
export class GoodsController {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
    private goodService: GoodService,
  ) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number,
    @Query('brands', new DefaultValuePipe([]), new ParseArrayPipe({ items: String, separator: ',' })) brands: string[],
  ) {
    console.log(`page: ${page} limit: ${limit} brands: ${brands && brands.length > 0 ? brands.join(', ') : 'none'}`)
    return this.goodService.findAll(page, limit, brands);
  }

  // 新接口：返回 wenting 和 德罗心的商品信息（不需要对比信息）
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('wenting_delosim')
  // 异步查找特殊商品
  async findSpecialGoods() {
    return this.goodService.findWentingDelosim();
  }
}
