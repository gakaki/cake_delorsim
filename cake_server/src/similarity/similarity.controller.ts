import { Controller, Get, Query } from '@nestjs/common';
import { SimilarityService } from './similarity.service';

@Controller('similarity')
export class SimilarityController {
  constructor(
    private readonly similarityService: SimilarityService,
  ) {}

  @Get('goodsCompare')
  async compareSimilarGoods(
    @Query('brand1') brand1: string,
    @Query('brand2') brand2: string,
  ) {
    return this.similarityService.findSimilarGoods(brand1, brand2);
  }
}