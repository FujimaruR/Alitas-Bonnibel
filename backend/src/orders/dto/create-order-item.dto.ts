import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
