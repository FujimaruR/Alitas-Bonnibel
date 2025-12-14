import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export type OrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY";

export class CreateOrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsEnum(["DINE_IN", "TAKEOUT", "DELIVERY"])
  type: OrderType;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsArray()
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsInt()
  @Min(1)
  table_id?: number;
}
