import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { YouZanService } from "./youzan.service";
import { Brand, Good, Category } from "../entities";
import { YouZanController } from "./youzan.controller";

@Module({
	imports: [
		HttpModule.registerAsync({
			useFactory: () => ({
				timeout: 5000,
				maxRedirects: 5,
			}),
		}),
		// HttpModule.registerAsync({
		//   imports: [ConfigModule],
		//   useFactory: async (configService: ConfigService) => ({
		//     timeout: configService.get('HTTP_TIMEOUT'),
		//     maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
		//   }),
		//   inject: [ConfigService],
		// });
		// HttpModule.register({
		//   timeout: 5000,
		//   maxRedirects: 5,
		// }),
		TypeOrmModule.forFeature([Brand, Category, Good]),
	],
	providers: [YouZanService],
	controllers: [YouZanController],
	exports: [YouZanService],
})
export class YouZanModule {}
