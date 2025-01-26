import { Controller, Get, Inject, Query, UseInterceptors } from '@nestjs/common';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Good } from '../entities/good.entity';
import { GoodService } from './good.service';

@Controller('goods')
// @UseInterceptors(CacheInterceptor)
export class GoodsController {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
    private  goodService: GoodService,
  ) { }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ) {
    console.log(`page: ${page} limit: ${limit}`)
    return this.goodService.findAll(page, limit);
  }
}

