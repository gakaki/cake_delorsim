// src/task.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskService } from "./task.service";
import { Brand, Category, Good } from "./entities";
import { YouZanModule } from "./youzan/youzan.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
	imports: [
		TypeOrmModule.forFeature([Brand, Category, Good]),
		forwardRef(() => YouZanModule),
		ScheduleModule.forRoot(),
		CacheModule.register(),
	],
	providers: [TaskService],
	exports: [TaskService],
})
export class TaskModule {}
