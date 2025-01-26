import { Test, TestingModule } from "@nestjs/testing";
import { YouZanController } from "./youzan.controller";
import { YouZanService } from "./youzan.service";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("YouZanController", () => {
	let controller: YouZanController;
	let service: YouZanService;

	const mockShelfConfig = {
		itemGroupList: [
			{
				groupId: 295444258,
				title: "新春限定",
				customSortGoods: [
					{ id: 3832720718, sort: 4 },
					{ id: 3832720149, sort: 3 },
				],
			},
		],
	};

	const mockBrand = {
		id: 1,
		name: "WentingG 文汀半糖蛋糕",
		appId: "wx2e2e28945c980c46",
		kdtId: "146387302",
		itemGroups: mockShelfConfig.itemGroupList,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [YouZanController],
			providers: [
				{
					provide: YouZanService,
					useValue: {
						fetchShelfConfig: vi.fn().mockResolvedValue(mockShelfConfig),
						syncBrandItemGroups: vi.fn().mockResolvedValue(mockBrand),
						getBrandItemGroups: vi
							.fn()
							.mockResolvedValue(mockShelfConfig.itemGroupList),
					},
				},
			],
		}).compile();

		controller = module.get<YouZanController>(YouZanController);
		service = module.get<YouZanService>(YouZanService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("getBrandItemGroups", () => {
		it("should return item groups for a brand", async () => {
			const result = await controller.getBrandItemGroups(
				"WentingG 文汀半糖蛋糕",
			);

			expect(result).toEqual(mockShelfConfig.itemGroupList);
			expect(service.getBrandItemGroups).toHaveBeenCalledWith(
				"WentingG 文汀半糖蛋糕",
			);
		});
	});

	describe("syncBrandItemGroups", () => {
		it("should sync item groups for WentingG brand", async () => {
			const result = await controller.syncBrandItemGroups(
				"WentingG 文汀半糖蛋糕",
			);

			expect(result).toEqual(mockBrand);
			expect(service.fetchShelfConfig).toHaveBeenCalledWith(
				"wx2e2e28945c980c46",
				"146387302",
			);
			expect(service.syncBrandItemGroups).toHaveBeenCalledWith(
				"WentingG 文汀半糖蛋糕",
				mockShelfConfig,
			);
		});

		it("should sync item groups for DeLuoXin brand", async () => {
			const result = await controller.syncBrandItemGroups("德罗心");

			expect(result).toEqual(mockBrand);
			expect(service.fetchShelfConfig).toHaveBeenCalledWith(
				"wx50d13a67c1b59969",
				"177397716",
			);
			expect(service.syncBrandItemGroups).toHaveBeenCalledWith(
				"德罗心",
				mockShelfConfig,
			);
		});

		it("should throw error for invalid brand name", async () => {
			await expect(
				controller.syncBrandItemGroups("InvalidBrand"),
			).rejects.toThrow("Invalid brand name");
		});
	});
});
