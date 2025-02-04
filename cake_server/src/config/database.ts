import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Brand } from "../entities/brand.entity";
import { Category } from "../entities/category.entity";
import { Good } from "../entities/good.entity";

export const databaseConfig: TypeOrmModuleOptions = {
	type: "postgres",
	host: "ep-shy-tree-a2u7ztjp.eu-central-1.pg.koyeb.app",
	port: 5432,
	username: "koyeb-adm",
	password: "npg_VSNXe7E9Ycrs",
	database: "koyebdb",
	entities: [Brand, Category, Good],
	synchronize: true,
	logging: false,
	ssl: {
		rejectUnauthorized: true,  // Enforce SSL certificate validation
	}
};
