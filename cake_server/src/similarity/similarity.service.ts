import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Good } from '../entities/good.entity';
import { Jieba } from '@node-rs/jieba';

interface SimilarityResult {
  good: Good;
  score: number;
}

@Injectable()
export class SimilarityService {
  constructor(
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
  ) {}

  // 计算文本相似度的方法
  public calculateTextSimilarity(text1: string, text2: string): number {
    // 使用结巴分词
    const tokens1 = cut(text1);
    const tokens2 = cut(text2);

    // 计算共同词的数量
    const commonTokens = tokens1.filter(token => tokens2.includes(token));
    
    // 相似度计算：共同词数量 / 总词数
    const similarity = (2 * commonTokens.length) / (tokens1.length + tokens2.length);
    
    return similarity;
  }

  async findSimilarGoods(brandName1: string, brandName2: string): Promise<SimilarityResult[]> {
    // 1. 查询第一个品牌的商品
    const goods1 = await this.goodRepository
      .createQueryBuilder('good')
      .leftJoinAndSelect('good.brand', 'brand')
      .where('brand.name LIKE :brandName', { brandName: `%${brandName1}%` })
      .getMany();

    // 2. 查询第二个品牌的商品
    const goods2 = await this.goodRepository
      .createQueryBuilder('good')
      .leftJoinAndSelect('good.brand', 'brand')
      .where('brand.name LIKE :brandName', { brandName: `%${brandName2}%` })
      .getMany();

    // 3. 比较相似度
    const similarityResults: SimilarityResult[] = [];

    for (const good1 of goods1) {
      const brandSimilarityResults = goods2.map(good2 => {
        // 如果品牌名完全相同，直接100%相似
        const brandNameSimilarity = good1.brand?.name === good2.brand?.name ? 1 : 0;
        
        // 描述相似度
        const descriptionSimilarity = this.calculateTextSimilarity(
          good1.description || '', 
          good2.description || ''
        );
        
        // 名称相似度
        const nameSimilarity = this.calculateTextSimilarity(
          good1.name, 
          good2.name
        );

        // 综合相似度计算
        const overallSimilarity = (brandNameSimilarity * 0.5) + 
                                   (descriptionSimilarity * 0.3) + 
                                   (nameSimilarity * 0.2);

        return {
          good: good2,
          score: overallSimilarity
        };
      });

      // 按相似度排序
      const sortedSimilarityResults = brandSimilarityResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // 取前5个最相似的

      similarityResults.push(...sortedSimilarityResults);
    }

    // 4. 按相似度降序排序
    return similarityResults.sort((a, b) => b.score - a.score);
  }

  // 可选：更新商品的相似度信息
  async updateGoodSimilarity(goodId: number, similarityData: any[]) {
    await this.goodRepository.update(goodId, {
      similarity: JSON.stringify(similarityData)
    });
  }
}