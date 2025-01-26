import { Test, TestingModule } from "@nestjs/testing";
import { BrandService } from "./brand.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Brand } from "./entities/brand";
import { Repository } from "typeorm";
import axios from "axios";
import { vitest, describe, beforeEach, it, expect, Mock } from "vitest";

vitest.mock("axios");

describe("BrandService", () => {
	let service: BrandService;
	let mockBrandRepository: Partial<Repository<Brand>>;

	beforeEach(async () => {
		mockBrandRepository = {
			create: vitest.fn(),
			save: vitest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BrandService,
				{
					provide: getRepositoryToken(Brand),
					useValue: mockBrandRepository,
				},
			],
		}).compile();

		service = module.get<BrandService>(BrandService);
	});

	it("should fetch Youzan shelf config", async () => {
		const mockResponse = {
			data: {
				code: 0,
				msg: "ok",
				data: {
					shelf: {
						itemGroupList: [],
						// other mock data
					},
				},
			},
		};

		(axios.post as Mockock).mockResolvedValue(mockResponse);

		const result = await service.fetchYouzanShelfConfig(
			"test-app-id",
			"test-kdt-id",
		);
		expect(result).toEqual(mockResponse.data);
	});
});
