import { validate } from "class-validator";
import { Brand } from "./brand";

describe("Brand Entity", () => {
	it("should create a valid brand", async () => {
		const brand = new Brand();
		brand.name = "WentingG";
		brand.appId = "wx50d13a67c1b59969";
		brand.kdtId = "177397716";
		brand.itemGroups = [];
		brand.shelfConfig = {};

		const errors = await validate(brand);
		expect(errors.length).toBe(0);
	});

	it("should require name", async () => {
		const brand = new Brand();
		brand.appId = "wx50d13a67c1b59969";

		const errors = await validate(brand);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints).toHaveProperty("isNotEmpty");
	});
});
