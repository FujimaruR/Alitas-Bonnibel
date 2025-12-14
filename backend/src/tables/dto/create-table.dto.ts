import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateTableDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(["FREE", "OCCUPIED", "RESERVED"])
  status?: "FREE" | "OCCUPIED" | "RESERVED";
}
