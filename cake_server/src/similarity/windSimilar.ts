import { load, cut } from '@node-rs/jieba';

// 加载分词词典
load();

export interface SimilarityOptions {
  threshold?: number;
  ignoreCase?: boolean;
  minTokenLength?: number;
}

export class WindSimilarity {
  /**
   * 分词方法
   * @param text 输入文本
   * @param options 分词配置
   * @returns 分词结果
   */
  static tokenize(
    text: string, 
    options: { 
      ignoreCase?: boolean; 
      minTokenLength?: number 
    } = {}
  ): string[] {
    const { 
      ignoreCase = true, 
      minTokenLength = 1 
    } = options;

    let tokens = cut(text);

    if (ignoreCase) {
      tokens = tokens.map(token => token.toLowerCase());
    }

    return tokens.filter(token => token.length >= minTokenLength);
  }

  /**
   * 计算词频向量
   * @param tokens 分词结果
   * @returns 词频对象
   */
  static createFrequencyVector(tokens: string[]): Record<string, number> {
    return tokens.reduce((freq, token) => {
      freq[token] = (freq[token] || 0) + 1;
      return freq;
    }, {} as Record<string, number>);
  }

  /**
   * 余弦相似度计算
   * @param vector1 第一个词频向量
   * @param vector2 第二个词频向量
   * @returns 相似度分数 0-1
   */
  static cosineSimilarity(
    vector1: Record<string, number>, 
    vector2: Record<string, number>
  ): number {
    const allTokens = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const token of allTokens) {
      const v1 = vector1[token] || 0;
      const v2 = vector2[token] || 0;
      
      dotProduct += v1 * v2;
      magnitude1 += v1 * v1;
      magnitude2 += v2 * v2;
    }

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  /**
   * 文本相似度分析
   * @param text1 第一个文本
   * @param text2 第二个文本
   * @param options 相似度计算选项
   * @returns 相似度分数和详细信息
   */
  static analyse(
    text1: string, 
    text2: string, 
    options: SimilarityOptions = {}
  ) {
    const {
      threshold = 0.5,
      ignoreCase = true,
      minTokenLength = 1
    } = options;

    const tokens1 = this.tokenize(text1, { ignoreCase, minTokenLength });
    const tokens2 = this.tokenize(text2, { ignoreCase, minTokenLength });

    const vector1 = this.createFrequencyVector(tokens1);
    const vector2 = this.createFrequencyVector(tokens2);

    const similarity = this.cosineSimilarity(vector1, vector2);

    return {
      score: similarity,
      isSimilar: similarity >= threshold,
      tokens1,
      tokens2,
      details: {
        commonTokens: tokens1.filter(token => tokens2.includes(token)),
        uniqueTokens1: tokens1.filter(token => !tokens2.includes(token)),
        uniqueTokens2: tokens2.filter(token => !tokens1.includes(token))
      }
    };
  }

  /**
   * 快速相似度检查
   * @param text1 第一个文本
   * @param text2 第二个文本
   * @param threshold 相似度阈值
   * @returns 是否相似
   */
  static isSimilar(
    text1: string, 
    text2: string, 
    threshold = 0.5
  ): boolean {
    const result = this.analyse(text1, text2, { threshold });
    return result.isSimilar;
  }
}

export default WindSimilarity;