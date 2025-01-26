import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { BrandController } from "./brand.controller";
import { Brand } from "./entities/brand";
import { Repository } from "typeorm";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { databaseConfig } from "./config/database";

describe("BrandController Integration", () => {
	let module: TestingModule;
	let controller: BrandController;
	let brandRepository: Repository<Brand>;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot(databaseConfig),
				TypeOrmModule.forFeature([Brand]),
			],
			controllers: [BrandController],
			//   providers: [ // If you want use real data not use this
			//     {
			//       provide: getRepositoryToken(Brand),
			//       useFactory: () => {
			//         return {
			//           find: async () => [],
			//           findOne: async () => null,
			//           save: async (brands) => brands
			//         };
			//       }
			//     }
			//   ]
		}).compile();

		controller = module.get<BrandController>(BrandController);
		brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));

		// Ensure test data exists
		await ensureTestData(brandRepository);
	});

	afterAll(async () => {
		await module.close();
	});

	async function ensureTestData(repo: Repository<Brand>) {
		const existingBrands = await repo.find();

		if (existingBrands.length < 2) {
			const brandsToInsert = [
				{
					name: "WentingG 文汀半糖蛋糕",
					appId: "wx2e2e28945c980c46",
					kdtId: "146387302",
					itemGroups: [
						{
							groupId: 295444258,
							groupTitle: "新春限定",
							customSortGoods: [
								{ id: 3832720718, sort: 4 },
								{ id: 3832720149, sort: 3 },
							],
						},
					],
				},
				{
					name: "德罗心",
					appId: "wx50d13a67c1b59969",
					kdtId: "177397716",
					itemGroups: [
						{
							groupId: 293503653,
							groupTitle: "节日特供",
							customSortGoods: [
								{ id: 3750147163, sort: 11 },
								{ id: 3750147164, sort: 12 },
							],
						},
					],
				},
			];

			await repo.save(brandsToInsert);
		}
	}

	it("should get all brands", async () => {
		const brands = await controller.getAllBrands();
		// console.log(brands);
		expect(brands.length).toBeGreaterThanOrEqual(0);
	});

	it("should get WentingG brand by name", async () => {
		const brand = await controller.getBrandByName("WentingG 文汀半糖蛋糕");
		expect(brand).toBeTruthy();
	});

	it("should get DeLuoXin brand by name", async () => {
		const brand = await controller.getBrandByName("德罗心");
		expect(brand).toBeTruthy();
	});

	it("should get WentingG brand items", async () => {
		const items = await controller.getBrandItems("WentingG 文汀半糖蛋糕");
		expect(items.length).toBeGreaterThanOrEqual(0);
	});

	it("should get DeLuoXin brand items", async () => {
		const items = await controller.getBrandItems("德罗心");
		expect(items.length).toBeGreaterThanOrEqual(0);
	});

	it("should return empty array for non-existent brand", async () => {
		const items = await controller.getBrandItems("NonExistentBrand");
		expect(items.length).toBe(0);
	});
});
