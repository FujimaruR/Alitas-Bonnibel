import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PublicOrdersController } from "./public-orders.controller";
import { PublicOrdersService } from "./public-orders.service";

@Module({
  controllers: [PublicOrdersController],
  providers: [PublicOrdersService, PrismaService],
})
export class PublicOrdersModule {}
