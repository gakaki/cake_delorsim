import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Good } from '../entities/good.entity';
import {compareBrandSimilarity} from "@/similarity/goodSimilar";
import { instanceToPlain } from 'class-transformer';
import {parse, stringify, toJSON, fromJSON} from 'flatted';

@Injectable()
export class GoodService {
  constructor(
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
  ) {}

  async findAll(page = 1, limit = 1000,brands:string[] = ["德罗心","WentingG"]) {
    const queryBuilder = this.goodRepository
      .createQueryBuilder('good')
      .leftJoinAndSelect('good.category', 'category')
      .leftJoinAndSelect('good.brand', 'brand')
      .select([
        'good.id',
        'good.name',
        'good.price',
        'good.description',
        'good.imageUrl',
        'category.id',
        'category.name',
        'brand.id', 
        'brand.name'
      ])
      // .where('brand.name LIKE :brandName', { brandName: '%WentingG%' })
      // .orWhere('brand.name LIKE :brandName', { brandName: '%德罗心%' })
      .take(limit)
      .skip((page - 1) * limit);

    let [goods, total] = await queryBuilder.getManyAndCount()
    console.log(goods.length,brands.length)
    goods = goods.filter( good => !good.name.includes('盘') )
    goods = goods.filter( g => g.brand?.name.includes(brands[0]) || g.brand?.name.includes(brands[1]))
    console.log(goods.length)
    goods = compareBrandSimilarity(goods)
    return {
      data:  goods,
      total,
      page,
      limit,
    };
  }

  async findWentingDelosim() {
    const queryBuilder = this.goodRepository
      .createQueryBuilder('good')
      .leftJoin('good.category', 'category')
      .leftJoin('good.brand', 'brand')
      .select([
        'good.id',
        'good.name',
        'good.price',
        'good.description',
        'good.imageUrl'
      ])
      .addSelect([
        'category.id',
        'category.name'
      ])
      .addSelect([
        'brand.id',
        'brand.name'
      ])//这里brandname不能重名的
      .where('brand.name LIKE :brandName1', { brandName1: '%文汀%' })
      .orWhere('brand.name LIKE :brandName2', { brandName2: '%德罗心%' });
      //打印生成的 SQL
    console.log(queryBuilder.getSql());

    let [goods, total] = await queryBuilder.getManyAndCount();
    console.log(goods.length);
    goods = goods.filter(good => !good.name.includes('盘'));
    // goods = goods.filter(good => good.brand?.name.includes('德罗心') || good.brand.name.includes('文汀'));
    goods = goods.filter( g => g.price > 4)

    // 将原始数据组装成你需要的结构
    goods = goods.map(raw => ({
      id: raw.id,
      name: raw.name,
      price: raw.price,
      description: raw.description,
      imageUrl: raw.imageUrl,
      category: {
        id: raw.category.id,
        name: raw.category.name,
      },
      brand: {
        id: raw.brand.id,
        name: raw.brand.name,
      }
    }));

    const goods_wenting = goods.filter(good => good.brand?.name.includes('文汀'));
    const goods_delosim = goods.filter(good => good.brand?.name.includes('德罗心'));

    console.log(goods.length);
    return {
      data: {
        "wenting" : goods_wenting,
        "delosim" : goods_delosim
      }
    };
  }

}