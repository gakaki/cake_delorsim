import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { Brand } from "./entities/brand.entity";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Brand]), ScheduleModule.forRoot()],
	providers: [BrandService],
	controllers: [BrandController],
	exports: [BrandService],
})
export class BrandModule {}
