import { IsEnum, IsOptional } from "class-validator";

export class UpdateOrderStatusDto {
  @IsEnum(["PENDING", "IN_PREPARATION", "READY", "SERVED", "CANCELLED"])
  status: "PENDING" | "IN_PREPARATION" | "READY" | "SERVED" | "CANCELLED";

  @IsOptional()
  @IsEnum(["UNPAID", "PAID", "REFUNDED"])
  payment_status?: "UNPAID" | "PAID" | "REFUNDED";
}
