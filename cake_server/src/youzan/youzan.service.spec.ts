import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule, HttpService } from "@nestjs/axios";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { of } from "rxjs";
import { YouZanService } from "./youzan.service";
import { Brand } from "../entities/brand";
import { Repository } from "typeorm";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { databaseConfig } from "../config/database";
import { Good } from "../entities/good.entity";
import { Category } from "../entities/category.entity";

describe("YouZanService", () => {
	let service: YouZanService;
	let httpService: HttpService;
	let brandRepository: Repository<Brand>;

	const mockBrand: Brand = {
		id: 1,
		name: "WentingG 文汀半糖蛋糕",
		appId: "wx2e2e28945c980c46",
		kdtId: "146387302",
		itemGroups: [],
		shelfConfig: undefined,
		createdAt: undefined,
		updatedAt: undefined,
	};

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

	const mockHttpResponse = {
		data: {
			data: {
				shelf: mockShelfConfig,
			},
		},
	};
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					...databaseConfig,
				}),
				TypeOrmModule.forFeature([Brand, Good, Category]),
				HttpModule,
			],
			providers: [
				YouZanService,
				// {
				//   provide: HttpService,
				//   useValue: {
				//     post: vi.fn(() => of(mockHttpResponse))
				//   }
				// },
				// {
				//   provide: getRepositoryToken(Brand),
				// //   useValue: {
				// //     findOne: vi.fn().mockResolvedValue(mockBrand),
				// //     save: vi.fn().mockResolvedValue(mockBrand)
				// //   }
				// }
			],
		}).compile();

		service = module.get<YouZanService>(YouZanService);
		httpService = module.get<HttpService>(HttpService);
		brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("fetchShelfConfig", () => {
		it("should fetch shelf config from Youzan API", async () => {
			//'WentingG 文汀半糖蛋糕':
			let appId = "wx2e2e28945c980c46";
			let kdtId = "146387302";
			let result = await service.fetchShelfConfig(
				"wx2e2e28945c980c46",
				"146387302",
			);
			console.log(result);
			expect(result).toEqual(mockShelfConfig);
			expect(httpService.post).toHaveBeenCalled();
			//  '德罗心':
			appId = "wx50d13a67c1b59969";
			kdtId = "177397716";
			console.log(result);
			expect(result).toEqual(mockShelfConfig);
			expect(httpService.post).toHaveBeenCalled();
		});
	});

	//   describe('syncBrandItemGroups', () => {
	//     it('should sync item groups for a brand', async () => {
	//       const result = await service.syncBrandItemGroups('WentingG 文汀半糖蛋糕', mockShelfConfig);

	//       expect(result).toEqual({
	//         ...mockBrand,
	//         itemGroups: [
	//           {
	//             groupId: 295444258,
	//             groupTitle: '新春限定',
	//             customSortGoods: [
	//               { id: 3832720718, sort: 4 },
	//               { id: 3832720149, sort: 3 }
	//             ]
	//           }
	//         ]
	//       });
	//       expect(brandRepository.save).toHaveBeenCalled();
	//     });

	//     it('should return null for non-existent brand', async () => {
	//       vi.spyOn(brandRepository, 'findOne').mockResolvedValue(null);

	//       const result = await service.syncBrandItemGroups('NonExistentBrand', mockShelfConfig);

	//       expect(result).toBeNull();
	//     });
	//   });

	//   describe('getBrandItemGroups', () => {
	//     it('should get item groups for a brand', async () => {
	//       const result = await service.getBrandItemGroups('WentingG 文汀半糖蛋糕');

	//       expect(result).toEqual([]);
	//     });
	//   });
});
