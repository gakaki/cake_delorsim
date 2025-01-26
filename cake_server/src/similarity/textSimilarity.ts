'use strict';

import { Jieba } from '@node-rs/jieba';
import { dict } from '@node-rs/jieba/dict'

const jieba = Jieba.withDict(dict)
console.log("start new jieba",jieba)

export class TextSimilarity {
  /**
   * 文本相似度查询
   * @param {String} textA 文本A
   * @param {String} textB 文本B
   */
  constructor(textA: string, textB: string) {
    this.segmentWordsA = this.segment(textA);
    this.segmentWordsB = this.segment(textB);
  }

  // 需要排除的词
  EXCLUDE_WORDS_ARRAY = ['的', '了', '和', '呢', '啊', '哦', '恩', '嗯', '吧'];

  // 词语分布对象
  distributionWordsArray: { [key: string]: number[] } = {};

  // 分词后的数组A
  segmentWordsA: string[] = [];

  // 分词后的数组B
  segmentWordsB: string[] = [];

  /**
   * 运行入口函数
   */
  run() {
    this.analyse();
    let rate = this.similarity();
    return rate ? rate : 'errors';
  }

  /**
   * 分析两段文本
   */
  analyse() {
    // 分析A片段
    this.segmentWordsA.forEach(element => {
      if (!this.EXCLUDE_WORDS_ARRAY.includes(element)) {
        if (!this.distributionWordsArray[element]) {
          this.distributionWordsArray[element] = [1, 0];
        } else {
          this.distributionWordsArray[element][0] += 1;
        }
      }
    });

    // 分析B片段
    this.segmentWordsB.forEach(element => {
      if (!this.EXCLUDE_WORDS_ARRAY.includes(element)) {
        if (!this.distributionWordsArray[element]) {
          this.distributionWordsArray[element] = [0, 1];
        } else {
          this.distributionWordsArray[element][1] += 1;
        }
      }
    });
  }

  /**
   * 处理相似度
   * @returns {Number}
   */
  similarity() {
    let [sum, sumWordsA, sumWordsB] = [0, 0, 0];
    for (const element in this.distributionWordsArray) {
      const wordsA = this.distributionWordsArray[element][0];
      const wordsB = this.distributionWordsArray[element][1];
      sum += wordsA * wordsB;
      sumWordsA += Math.pow(wordsA, 2);
      sumWordsB += Math.pow(wordsB, 2);
    }
    if (sumWordsA === 0 || sumWordsB === 0) {
      return 0; // 避免除以零的情况
    }
    return sum / Math.sqrt(sumWordsA * sumWordsB);
  }

  /**
   * 简单分词
   * @param {String} text 文本
   * @returns {Array}
   */
  segment(text: string): string[] {
    if (!text) return [];
    return jieba.cut(text);
  }
}

