import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { describe, it, expect, beforeAll } from 'vitest';
import { SimilarityService } from './similarity.service';
import { Good } from '../entities/good.entity';
import { Brand } from '../entities/brand.entity';
import { databaseConfig } from '../config/database';

describe('SimilarityService', () => {
  let service: SimilarityService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature([Good, Brand])
      ],
      providers: [SimilarityService]
    }).compile();

    service = module.get<SimilarityService>(SimilarityService);
  });

  it('should find similar goods between two brands', async () => {
    const brands = ['文汀', '德罗心'];
    
    const results = await service.findSimilarGoods(brands[0], brands[1]);
    
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    
    // 检查相似度结果
    if (results.length > 0) {
      results.forEach(result => {
        expect(result).toHaveProperty('good');
        expect(result).toHaveProperty('score');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
      });

      // 检查是否按相似度降序排序
      for (let i = 1; i < results.length; i++) {
        expect(results[i-1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    }
  });

  it('should handle brands with no similar goods', async () => {
    const results = await service.findSimilarGoods('非常罕见的品牌1', '非常罕见的品牌2');
    
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it('should calculate text similarity correctly', async () => {
    const testCases = [
      { text1: '这是一个测试', text2: '这是测试', expected: 0.75 },
      { text1: '完全不同的文本', text2: '另一个完全不同的文本', expected: 0 },
      { text1: '相同的文本', text2: '相同的文本', expected: 1 }
    ];

    testCases.forEach(({ text1, text2, expected }) => {
      const similarity = service.calculateTextSimilarity(text1, text2);
      expect(similarity).toBeCloseTo(expected, 1);
    });
  });
});