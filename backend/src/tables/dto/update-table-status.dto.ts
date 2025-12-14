import { IsEnum } from "class-validator";

export class UpdateTableStatusDto {
  @IsEnum(["FREE", "OCCUPIED", "RESERVED"])
  status: "FREE" | "OCCUPIED" | "RESERVED";
}
