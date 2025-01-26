import { Controller, Get, Param, Post } from "@nestjs/common";
import { YouZanService } from "./youzan.service";

@Controller("youzan")
export class YouZanController {
	constructor(private readonly youZanService: YouZanService) {}
	@Post("sync")
	async syncBrands() {
		return this.youZanService.sync();
	}
}
