import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminMenuController } from "./admin-menu.controller";
import { AdminMenuService } from "./admin-menu.service";

@Module({
  imports: [PrismaModule],
  controllers: [AdminMenuController],
  providers: [AdminMenuService],
})
export class AdminMenuModule {}
