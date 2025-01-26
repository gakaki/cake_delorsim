import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737819132626 implements MigrationInterface {
	name = "Migration1737819132626";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "brand" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "appId" character varying NOT NULL, "kdtId" character varying NOT NULL, "json" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "imageUrl" character varying, "url" character varying, "json" jsonb, "brandId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "good" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "imageUrl" character varying, "price" numeric(10,2), "url" character varying, "json" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" integer, "brandId" integer, CONSTRAINT "PK_0aceec75d523693a51fad812e2e" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "category" ADD CONSTRAINT "FK_2f02288c736913717de6855e658" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "good" ADD CONSTRAINT "FK_87d29fce743b048a9deaa5cb67e" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "good" ADD CONSTRAINT "FK_06638c7d32d2d921bcc9db12b68" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "good" DROP CONSTRAINT "FK_06638c7d32d2d921bcc9db12b68"`,
		);
		await queryRunner.query(
			`ALTER TABLE "good" DROP CONSTRAINT "FK_87d29fce743b048a9deaa5cb67e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "category" DROP CONSTRAINT "FK_2f02288c736913717de6855e658"`,
		);
		await queryRunner.query(`DROP TABLE "good"`);
		await queryRunner.query(`DROP TABLE "category"`);
		await queryRunner.query(`DROP TABLE "brand"`);
	}
}
