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

  async findAll() {
    return this.brandRepository.findAndCount();
  }

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

  async truncateTable() {
    try {
      // Truncate the table and reset the identity (auto-increment) sequence
      await this.brandRepository.query('TRUNCATE TABLE "brand" RESTART IDENTITY CASCADE');
      this.logger.log('Brand table truncated and reset successfully');
    } catch (error) {
      this.logger.error('Error truncating brand table', error);
      throw error;
    }
  }
  async resetPrimaryKeySequence() {
    try {
      // Reset the primary key sequence to start from 1
      await this.brandRepository.query('ALTER SEQUENCE brand_id_seq RESTART WITH 1');
      this.logger.log('Brand table primary key sequence reset to 1');
    } catch (error) {
      this.logger.error('Error resetting brand table primary key sequence', error);
      throw error;
    }
  }
}