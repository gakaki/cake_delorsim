import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { YouZanService } from "./youzan.service";

@Injectable()
export class TasksService {
	constructor(private readonly youZanService: YouZanService) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async sync() {
		await this.youZanService.sync();
	}
}
