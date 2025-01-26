import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { YouZanService } from "./youzan.service";

@Injectable()
export class TasksService {
	constructor(private readonly youZanService: YouZanService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async syncBrandItemGroups() {
		// Fetch and sync for WentingG
		const wentingGShelf = await this.youZanService.fetchShelfConfig(
			"wx2e2e28945c980c46",
			"146387302",
		);
		await this.youZanService.syncBrandItemGroups(
			"WentingG 文汀半糖蛋糕",
			wentingGShelf,
		);

		// Fetch and sync for DeLuoXin
		const deluoXinShelf = await this.youZanService.fetchShelfConfig(
			"wx50d13a67c1b59969",
			"177397716",
		);
		await this.youZanService.syncBrandItemGroups("德罗心", deluoXinShelf);
	}
}
