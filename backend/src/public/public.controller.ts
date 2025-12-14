import { Controller, Get, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public")
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get("featured")
  async featured(@Query("limit") limit?: string) {
    const take = Math.min(Number(limit ?? 6), 24);

    const items = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        badges: true,
      },
    });

    return items;
  }
}
