import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Brand } from './entities';
import axios from 'axios';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async fetchYouzanShelfConfig(appId: string, kdtId: string) {
    try {
      const response = await axios.post(
        'https://h5.youzan.com/retail/h5/miniprogram/shelf-config/getFirstLevelConfigs',
        {
          goodsFilterType: 0,
          alias: 'uUKBWb5BUZ',
          mode: '1',
          userLocation: {},
          retailSource: 'MINAPP-SHELF-3.41.5',
          useSwitch: 'v2',
          supportUnavailableGoods: 2,
          supportFixGroupOptionalCombo: true,
          screenWidth: 414,
        },
        {
          params: { app_id: appId, kdt_id: kdtId },
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'h5.youzan.com',
            'Connection': 'keep-alive',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching Youzan shelf config', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateBrandData() {
    const brands = [
      { name: 'WentingG', appId: 'wx50d13a67c1b59969', kdtId: '177397716' },
      { name: 'DeLuoXin', appId: 'wx50d13a67c1b59969', kdtId: '177397716' }
    ];

    for (const brand of brands) {
      try {
        const shelfConfig = await this.fetchYouzanShelfConfig(brand.appId, brand.kdtId);
        
        const brandEntity = this.brandRepository.create({
          name: brand.name,
          appId: brand.appId,
          kdtId: brand.kdtId,
          itemGroups: shelfConfig.data.shelf.itemGroupList,
          shelfConfig: shelfConfig.data.shelf
        });

        await this.brandRepository.save(brandEntity);
        this.logger.log(`Updated data for brand: ${brand.name}`);
      } catch (error) {
        this.logger.error(`Error updating brand ${brand.name}`, error);
      }
    }
  }
}