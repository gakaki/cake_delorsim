import { describe, it, expect } from 'vitest';
import { WindSimilarity } from './windSimilar';

describe('TextSimilarity', () => {
  describe('tokenize', () => {
    it('should tokenize Chinese text correctly', () => {
      const text = '这是一个测试文本';
      const tokens = WindSimilarity.tokenize(text);
      
      expect(tokens).toBeInstanceOf(Array);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens).toContain('这是');
      expect(tokens).toContain('测试');
      expect(tokens).toContain('文本');
    });

    it('should handle case sensitivity', () => {
      const text = 'Hello WORLD Test';
      const sensitiveTokens = WindSimilarity.tokenize(text, { ignoreCase: false });
      const insensitiveTokens = WindSimilarity.tokenize(text, { ignoreCase: true });

      expect(sensitiveTokens).not.toEqual(insensitiveTokens);
    });

    it('should filter tokens by minimum length', () => {
      const text = '这是一个测试文本';
      const tokens1 = WindSimilarity.tokenize(text, { minTokenLength: 1 });
      const tokens2 = WindSimilarity.tokenize(text, { minTokenLength: 2 });

      expect(tokens1.length).toBeGreaterThan(tokens2.length);
    });
  });

  describe('createFrequencyVector', () => {
    it('should create correct frequency vector', () => {
      const tokens = ['apple', 'banana', 'apple', 'cherry'];
      const vector = WindSimilarity.createFrequencyVector(tokens);

      expect(vector).toEqual({
        'apple': 2,
        'banana': 1,
        'cherry': 1
      });
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const vector1 = { 'apple': 1, 'banana': 2 };
      const vector2 = { 'apple': 2, 'banana': 1 };

      const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return 0 for completely different vectors', () => {
      const vector1 = { 'apple': 1 };
      const vector2 = { 'banana': 1 };

      const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBe(0);
    });

    it('should return 1 for identical vectors', () => {
      const vector1 = { 'apple': 2, 'banana': 3 };
      const vector2 = { 'apple': 2, 'banana': 3 };

      const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBe(1);
    });
  });

  describe('analyse', () => {
    it('should analyze text similarity', () => {
      const text1 = '这是一个测试文本';
      const text2 = '这是测试的文本';

      const result = WindSimilarity.analyse(text1, text2);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('isSimilar');
      expect(result).toHaveProperty('tokens1');
      expect(result).toHaveProperty('tokens2');
      expect(result).toHaveProperty('details');
      
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should respect similarity threshold', () => {
      const text1 = '这是一个非常相似的文本';
      const text2 = '这是一个相似的文本';

      const resultLowThreshold = WindSimilarity.analyse(text1, text2, { threshold: 0.3 });
      const resultHighThreshold = WindSimilarity.analyse(text1, text2, { threshold: 0.8 });

      expect(resultLowThreshold.isSimilar).toBe(true);
      expect(resultHighThreshold.isSimilar).toBe(false);
    });
  });

  describe('isSimilar', () => {
    it('should quickly check text similarity', () => {
      const text1 = '这是一个测试文本';
      const text2 = '这是测试的文本';

      const similarResult = WindSimilarity.isSimilar(text1, text2, 0.5);
      const dissimilarResult = WindSimilarity.isSimilar(text1, '完全不同的文本', 0.5);

      expect(similarResult).toBe(true);
      expect(dissimilarResult).toBe(false);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = WindSimilarity.analyse('', '');
      
      expect(result.score).toBe(0);
      expect(result.isSimilar).toBe(false);
    });

    it('should handle very different texts', () => {
      const text1 = '这是第一个文本';
      const text2 = '这是完全不同的文本';

      const result = WindSimilarity.analyse(text1, text2);
      
      expect(result.score).toBeLessThan(0.5);
      expect(result.isSimilar).toBe(false);
    });
  });
});