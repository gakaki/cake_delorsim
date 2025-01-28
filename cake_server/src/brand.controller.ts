import { Controller, Get, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities';
import { Repository } from 'typeorm';

@Controller('brands')
// @UseInterceptors(CacheInterceptor)
export class BrandController {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
    private brandService: BrandService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) { }

  @Get() 
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 1000,
  ) {
    console.log(`page: ${page} limit: ${limit}`)
    return this.brandService.findAll();
  }
}
