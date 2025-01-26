import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Brand } from "../entities/brand.entity";
import { Category } from "../entities/category.entity";
import { Good } from "../entities/good.entity";

export const databaseConfig: TypeOrmModuleOptions = {
	type: "postgres",
	host: "db.yugyfhvjowebnuhdupgf.supabase.co",
	port: 5432,
	username: "postgres",
	password: "ilovePs5",
	database: "postgres",
	entities: [Brand, Category, Good],
	synchronize: true,
	logging: false,
};
