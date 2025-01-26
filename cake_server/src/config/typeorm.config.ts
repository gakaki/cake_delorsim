import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { Brand } from "../entities/brand.entity";
import { Category } from "../entities/category.entity";
import { Good } from "../entities/good.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

config();

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: "db.yugyfhvjowebnuhdupgf.supabase.co",
	port: 5432,
	username: "postgres",
	password: "ilovePs5",
	database: "postgres",
	entities: ["src/**/*.entity.ts"],
	migrations: ["src/migrations/*.ts"],
	synchronize: true,
	logging: false,
};

export const dataSource = new DataSource(dataSourceOptions);
