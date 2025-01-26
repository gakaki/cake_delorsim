import { Controller, Get, Query } from '@nestjs/common';
import { SimilarityService } from './similarity.service';
import { SimilarityResult } from './similarity.service'; // 导入 SimilarityResult 类型

@Controller('similarity')
export class SimilarityController {
  constructor(
    private readonly similarityService: SimilarityService,
  ) {}

  @Get('goodsCompare')
  async compareSimilarGoods(
    @Query('brand1') brand1: string,
    @Query('brand2') brand2: string,
  ): Promise<SimilarityResult[]> { // 明确返回类型
    return this.similarityService.findSimilarGoods(brand1, brand2);
  }
}