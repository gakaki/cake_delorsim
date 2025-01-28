import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from "typeorm";
import { IsNotEmpty, IsString, IsArray, IsOptional, IsEmpty } from "class-validator";
import { Category } from "./category.entity";
import { Good } from "./good.entity";
import { Exclude } from "class-transformer";

@Entity("brand")
export class Brand {
	@PrimaryGeneratedColumn()
	id: number = 0;

	@Column()
	@IsNotEmpty()
	@IsString()
	name: string = "";

	@Column()
	@IsNotEmpty()
	@IsString()
	appId: string = "";

	@Column()
	@IsNotEmpty()
	@IsString()
	kdtId: string = "";

	@Column({ default: '', nullable: true })
	@IsEmpty()
	@IsString()
	alias: string = ""; //给postbody请求用 

	@Column("json", { nullable: true })
	json: any = null; // Store the original JSON response

	@OneToMany(
		() => Category,
		(category) => category.brand,
		{ 
			createForeignKeyConstraints: false,
		},
	)
	categories?: Relation<Category[]>;

	@OneToMany(
		() => Good,
		(good) => good.brand,
		{ 
			createForeignKeyConstraints: false,
		},
	)
	goods?: Relation<Good[]>;

	@Exclude()
	@Column({ nullable: true })
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date = new Date();

	@Exclude()
	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date = new Date();
}
