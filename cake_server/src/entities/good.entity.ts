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
import { Exclude, instanceToPlain } from 'class-transformer';

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

	@Exclude()
	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	url: string = "";

	@Exclude()
	@Column("json", { nullable: true })
	json: any = null;



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
  	similarGoods:SimilarityGood[] = []

	// toJSON() { // no suage
	// 	this.similarGoods.map( i => instanceToPlain(i))
	// 	return this
	// }

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

export class SimilarityGood {
    good: Good;
	@Exclude()
    similarity_name: SimilarityAnalysisResult ;

	@Exclude()
    similarity_description: SimilarityAnalysisResult;
	
	similarity_number_max: Number
	similarity_number_average: Number
	similarity_name_number: Number
	similarity_description_number: Number
}