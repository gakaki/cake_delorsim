import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToMany,
	Relation,
} from "typeorm";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Brand } from "./brand.entity";
import { Good } from "./good.entity";
import { Exclude } from "class-transformer";

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
			createForeignKeyConstraints: false,
		},
	)
	@JoinColumn({ name: "brandId" })
	brand?: Relation<Brand>;

	@OneToMany(
		() => Good,
		(good) => good.category,
		{
			createForeignKeyConstraints: false,
		},
	)
	goods?: Relation<Good[]>;

	
	@Column({ nullable: true })
	brandId?: number;

	@Exclude()
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
