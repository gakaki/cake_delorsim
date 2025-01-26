import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Good } from '../entities/good.entity';

@Injectable()
export class GoodService {
  constructor(
    @InjectRepository(Good)
    private goodRepository: Repository<Good>,
  ) {}

  async findAll(page = 1, limit = 1000) {
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
      .take(limit)
      .skip((page - 1) * limit);

    const [goods, total] = await queryBuilder.getManyAndCount();

    return {
      data: goods,
      total,
      page,
      limit,
    };
  }
}