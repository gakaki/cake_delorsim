import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { Brand } from "../entities/brand.entity";
import { Category } from "../entities/category.entity";
import { Good } from "../entities/good.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

config();

// export const dataSourceOptions: DataSourceOptions = {
// 	type: "postgres",
// 	host: "db.yugyfhvjowebnuhdupgf.supabase.co",
// 	port: 5432,
// 	username: "postgres",
// 	password: "ilovePs5",
// 	database: "postgres",
// 	entities: ["src/**/*.entity.ts"],
// 	migrations: ["src/migrations/*.ts"],
// 	synchronize: true,
// 	logging: false,
// };


export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: "ep-shy-tree-a2u7ztjp.eu-central-1.pg.koyeb.app",
	port: 5432,
	ssl: {
		rejectUnauthorized: true,  // Enforce SSL certificate validation
	},
	username: "koyeb-adm",
	password: "npg_VSNXe7E9Ycrs",
	database: "koyebdb",
	entities: ["src/**/*.entity.ts"],
	migrations: ["src/migrations/*.ts"],
	synchronize: true,
	logging: false,
};


export const dataSource = new DataSource(dataSourceOptions);
