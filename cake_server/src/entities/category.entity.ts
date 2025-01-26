import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from "typeorm";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Brand } from "./brand.entity";
import { Good } from "./good.entity";

@Entity("category")
export class Category {
	@PrimaryGeneratedColumn()
	id: number = 0;

	@Column()
	@IsNotEmpty()
	@IsString()
	name: string = "";

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	imageUrl: string = "";

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	url: string = "";

	@Column("jsonb", { nullable: true })
	json: any = null; // Store the original JSON response as a JSON column

	@ManyToOne(
		() => Brand,
		(brand) => brand.categories,
		{
			nullable: true,
			onDelete: "SET NULL",
		},
	)
	@JoinColumn({ name: "brandId" })
	brand?: Brand;

	@OneToMany(
		() => Good,
		(good) => good.category,
	)
	goods?: Good[];

	@Column({ nullable: true })
	brandId?: number;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date = new Date();

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date = new Date();
}
