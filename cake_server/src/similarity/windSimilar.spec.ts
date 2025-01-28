import {describe, it, expect} from 'vitest';
import {WindSimilarity} from './windSimilar';
import { Good} from '../entities';
import { compareBrandSimilarity } from "./goodSimilar"
import {classToPlain, instanceToPlain} from 'class-transformer';


describe('TextSimilarity', () => {
    describe('tokenize', () => {
        it('should tokenize Chinese text correctly', () => {
            const text = '这是一个测试文本';
            const tokens = WindSimilarity.tokenize(text);

            expect(tokens).toBeInstanceOf(Array);
            expect(tokens.length).toBeGreaterThan(0);
        });

        it('should handle case sensitivity', () => {
            const text = 'Hello WORLD Test';
            const sensitiveTokens = WindSimilarity.tokenize(text, {ignoreCase: false});
            const insensitiveTokens = WindSimilarity.tokenize(text, {ignoreCase: true});

            expect(sensitiveTokens).not.toEqual(insensitiveTokens);
        });

        it('should filter tokens by minimum length', () => {
            const text = '这是一个测试文本';
            const tokens1 = WindSimilarity.tokenize(text, {minTokenLength: 1});
            const tokens2 = WindSimilarity.tokenize(text, {minTokenLength: 2});
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

    // describe('cosineSimilarity', () => {
    //   it('should calculate cosine similarity correctly', () => {
    //     const vector1 = { 'apple': 1, 'banana': 2 };
    //     const vector2 = { 'apple': 2, 'banana': 1 };

    //     const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);
    //     console.log(similarity);
    //     expect(similarity).toBeGreaterThan(0);
    //     expect(similarity).toBeLessThanOrEqual(1);
    //   });

    //   it('should return 0 for completely different vectors', () => {
    //     const vector1 = { 'apple': 1 };
    //     const vector2 = { 'banana': 1 };

    //     const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);

    //     expect(similarity).toBe(0);
    //   });

    //   it('should return 1 for identical vectors', () => {
    //     const vector1 = { 'apple': 2, 'banana': 3 };
    //     const vector2 = { 'apple': 2, 'banana': 3 };

    //     const similarity = WindSimilarity.cosineSimilarity(vector1, vector2);

    //     expect(similarity).toBe(1);
    //   });
    // });

    // describe('analyse', () => {
    //   it('should analyze text similarity', () => {
    //     const text1 = '这是一个测试文本';
    //     const text2 = '这是测试的文本';

    //     const result = WindSimilarity.analyse(text1, text2);

    //     expect(result).toHaveProperty('score');
    //     expect(result).toHaveProperty('isSimilar');
    //     expect(result).toHaveProperty('tokens1');
    //     expect(result).toHaveProperty('tokens2');
    //     expect(result).toHaveProperty('details');

    //     expect(result.score).toBeGreaterThanOrEqual(0);
    //     expect(result.score).toBeLessThanOrEqual(1);
    //   });

    //   it('should respect similarity threshold', () => {
    //     const text1 = '这是一个非常相似的文本';
    //     const text2 = '这是一个相似的文本';

    //     const resultLowThreshold = WindSimilarity.analyse(text1, text2, { threshold: 0.3 });
    //     const resultHighThreshold = WindSimilarity.analyse(text1, text2, { threshold: 0.8 });
    //     console.log(resultLowThreshold, resultHighThreshold);
    //     expect(resultLowThreshold.isSimilar).toBe(true);
    //     expect(resultHighThreshold.isSimilar).toBe(false);
    //   });
    // });

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
            // console.log(result)
            expect(result.score).toBeLessThan(0.9);
            expect(result.isSimilar).toBe(false);
        });
    });

});


// // 验证相似性结果的辅助方法
// const validateSimilarityResults = function (
//     items: [Good | null][],
//     other_low_score_items: Good[]
// ) {
//     // 断言检查
//     expect(items.length).toBeGreaterThan(0);
//     items.forEach(item => {
//         // 确保相似商品来自不同品牌
//         expect(item[0].brand?.id).not.toBe(item[1]?.brand?.id);
//         // 确保至少有一个相似商品
        
//         // 确保商品价格大于等于4
//         expect(item[0].price).toBeGreaterThanOrEqual(4);
        
//         // 确保similarGoods数组不为空
//         expect(item[0].similarGoods?.length).toBeGreaterThan(0);
//     });
// }

describe('蛋糕文字对比', () => {
    it('文汀 对 德罗心蛋糕 ', () => {
        const text1 = '草莓，车厘子，鲜奶奶油，蜂蜜戚风蛋糕，草莓冻，百里香，糖粉' //wenting
        const text2 = '黑巧戚风与草莓奶油的完美搭配，草莓与黑莓的酸甜，脆脆麦丽素口感丰富。'; //德罗心

        const result = WindSimilarity.analyse(text1, text2);
        // console.log(result)
        expect(result.score).toBeLessThan(0.9);
        expect(result.isSimilar).toBe(false);
    })

    it('针对json主动筛选出数据展示 文汀和德罗心的 "草莓" 相似性比较', () => {
        let data        = require("./cake.json").data as Good[];
        data            = data.slice(0,50)
        data            = data.filter( g => g.name.includes("草莓"))
        let goodsByBrand  = compareBrandSimilarity(data);
        console.log(JSON.stringify(goodsByBrand)) //这里只适合用来做调试打印了
    })
    it('针对json主动筛选出数据展示 多个品牌间商品相似性比较', () => {
        let data        = require("./cake.json").data as Good[];
        const goodsByBrand  = compareBrandSimilarity(data);
        console.log( JSON.stringify(goodsByBrand)) //这里只适合用来做调试打印了
    })
});