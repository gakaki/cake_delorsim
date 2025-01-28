import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Relation,
} from "typeorm";
import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsNumber,
	IsBoolean,
} from "class-validator";
import { Category } from "./category.entity";
import { Brand } from "./brand.entity";
import { SimilarityAnalysisResult } from "@/similarity/windSimilar";
import { Exclude } from 'class-transformer';
import { toJSON } from "flatted";

@Entity("good")
export class Good {
	@PrimaryGeneratedColumn()
	id: number = 0;

	@Column()
	@IsNotEmpty()
	@IsString()
	name: string = "";

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	description: string = "";

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	imageUrl: string = "";

	@Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
	@IsOptional()
	@IsNumber()
	price: number = 0;

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	url: string = "";

	@Column("json", { nullable: true })
	json: any = null;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date = new Date();

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date = new Date();

	@ManyToOne(
		() => Category,
		(category) => category.goods,
		{
			nullable: true,
			onDelete: "SET NULL",
			createForeignKeyConstraints: false,
		},
	)
	@JoinColumn({ name: "categoryId" })
	category?:Relation<Category>;

	@Column({ nullable: true })
	categoryId?: number;

	@ManyToOne(
		() => Brand,
		(brand) => brand.goods,
		{
			nullable: true,
			onDelete: "SET NULL",
			createForeignKeyConstraints: false,
		},
	)
	@JoinColumn({ name: "brandId" })
	brand?: Relation<Brand>;
  
	@Column({ nullable: true })
	brandId?: number;

  	//类似的商品
  	// @Exclude({ toPlainOnly: true })
  	similarGoods:SimilarityGood[] = []

}

export interface SimilarityGood {
    good: Good;
    similarity_name: SimilarityAnalysisResult
    similarity_description: SimilarityAnalysisResult
	similarity_number_max: Number
	similarity_number_average: Number
	similarity_name_number: Number
	similarity_description_number: Number
}