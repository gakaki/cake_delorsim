import { Brand, Good,SimilarityGood } from "@/entities";
import WindSimilarity from "./windSimilar";



// 准备商品数据的辅助方法
export const prepareGoodsData = (data: Good[] = []) => {
    // 1. 过滤掉价格低于4的商品
    const filteredGoods = data.filter(good => good.price >= 4 );
    console.log(`总商品数量: ${data.length}, 过滤后商品数量: ${filteredGoods.length}`);
    // 2. 提取所有独特的品牌，并按品牌ID排序
    const uniqueBrands = Array.from(
        new Map(
            data
                .map(good => good.brand as Brand)
                .filter((brand): brand is Brand => brand !== null && brand !== undefined)
                .map(brand => [brand.id, brand])
        ).values()
    ).sort((a, b) => a.id - b.id);
    // uniqueBrands.pop() //测试去掉多余的品牌
    console.log(`品牌数量: ${uniqueBrands.length}`);
    // 4. 按品牌分组商品
    const goodsByBrand = uniqueBrands.map(brand =>
        filteredGoods.filter(good => good.brand?.id === brand.id)
    );
    return goodsByBrand
}

// 比较品牌间商品相似性的辅助方法
export  const compareBrandSimilarity = (data: Good[]): Good[][] => {
    const goodsByBrand = prepareGoodsData(data)
    for (let i = 0; i < goodsByBrand.length; i++) {
        const currentBrandGoods = goodsByBrand[i];
        for (const currentGood of currentBrandGoods) {
            currentGood.similarGoods = []
            // 与其他品牌的商品比较 所以这里+了1 从第二个开始吗
            // for (let j = i + 1; j < goodsByBrand.length; j++) {
            for (let j = 0; j < goodsByBrand.length; j++) {
                if (goodsByBrand[j].length > 0){
                    if  ( currentGood.brand?.name == goodsByBrand[j][0].brand?.name ) {
                        continue;
                    }
                    const otherBrandGoods = goodsByBrand[j];
                    const similarGoods = findSimilarGoods(currentGood, otherBrandGoods);
                    if (similarGoods.length > 0) {
                        currentGood.similarGoods.push(...similarGoods);
                    }
                }
            }
        }
    }
    return goodsByBrand
}

// 查找相似商品的辅助方法
export  const findSimilarGoods = (currentGood: Good, otherBrandGoods: Good[]): SimilarityGood[] => {
    //跳过相同组比较
    if  ( currentGood.brand?.name == otherBrandGoods[0].brand?.name ) {
        throw new Error("不应该出现 相同brand name的情况")
    }
    const similarGoods: SimilarityGood[] = [];
    for (const otherGood of otherBrandGoods) {
        // 比较商品描述的相似性
        const result_name = WindSimilarity.analyse(
            currentGood.name || '',
            otherGood.name || ''
        );
        // 比较商品描述的相似性
        const result_description = WindSimilarity.analyse(
            currentGood.description || '',
            otherGood.description || ''
        );
        similarGoods.push({
            good:otherGood,
            similarity_number_max : Math.max(result_name.score , result_description.score) ,
            similarity_number_average : (result_name.score + result_description.score) /2 ,
            similarity_name_number: result_name.score,
            similarity_description_number: result_description.score,
            similarity_name: result_name,
            similarity_description: result_description
        });
    }
    // 按相似度降序排序z
    return similarGoods.sort((a, b) => Number(b.similarity_number_max) - Number(a.similarity_number_max));
}
