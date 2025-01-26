import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";
import { Category } from "./category.entity";
import { Good } from "./good.entity";

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

	@Column("json", { nullable: true })
	json: any = null; // Store the original JSON response

	@OneToMany(
		() => Category,
		(category) => category.brand,
	)
	categories?: Category[];

	@OneToMany(
		() => Good,
		(good) => good.brand,
	)
	goods?: Good[];

	@Column({ nullable: true })
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date = new Date();

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date = new Date();
}
