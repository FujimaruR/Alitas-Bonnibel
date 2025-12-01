import { IsEnum, IsString, MaxLength } from 'class-validator';
import { TableStatus } from '../../generated/prisma/client';

export class CreateTableDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsEnum(TableStatus)
  status: TableStatus;
}
