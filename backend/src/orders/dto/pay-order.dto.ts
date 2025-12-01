import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { PaymentStatus } from '../../generated/prisma/client';

export class PayOrderDto {
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus; // normalmente PAID o REFUNDED

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_amount?: number; // por si quieres ajustar el total al pagar
}
