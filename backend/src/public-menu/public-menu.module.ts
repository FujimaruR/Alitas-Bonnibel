import { Module } from "@nestjs/common";
import { PublicMenuController } from "./public-menu.controller";
import { PublicMenuService } from "./public-menu.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PublicMenuController],
  providers: [PublicMenuService],
})
export class PublicMenuModule {}
