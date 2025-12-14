import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDto {
  @IsOptional() @IsInt() categoryId?: number;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() @Min(0) price?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() badges?: string[];
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}
