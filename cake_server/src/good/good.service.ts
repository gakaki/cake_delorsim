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

}