import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsInt()
  categoryId: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[];
}
