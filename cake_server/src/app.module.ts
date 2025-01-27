import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BrandModule } from "./brand.module";
import { ScheduleModule } from "@nestjs/schedule";
import { databaseConfig } from "./config/database";
import { YouZanModule } from "./youzan/youzan.module";
import { TaskModule } from "./task.module";
import { BrandController } from "./brand.controller";
import { GoodsController } from "./good/goods.controller";
import { Brand, Category, Good } from "./entities";
import { CacheModule } from "@nestjs/cache-manager";
import { GoodService } from "./good/good.service";
import { SimilarityService } from "./similarity/similarity.service";
import { SimilarityController } from './similarity/similarity.controller';
import { BrandService } from "./brand.service";
import compression from '@fastify/compress';

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
			max: 100, // Maximum number of items in cache
			ttl: 60, // Default TTL in seconds
		}),
		TypeOrmModule.forRoot(databaseConfig),
		TypeOrmModule.forFeature([Good, Brand, Category]),
		// forwardRef(() => BrandModule), 加了会说 router 找不到brands 也就是module里和下面controller会重复的 就用一个
		// module写了 下面controller就不要写了
		forwardRef(() => YouZanModule),
		forwardRef(() => TaskModule),
	],
	controllers: [AppController, GoodsController, BrandController, SimilarityController],
	providers: [AppService,GoodService,BrandService,SimilarityService],
})
export class AppModule {}

