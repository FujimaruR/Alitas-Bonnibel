import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PublicMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getMenu() {
    // Trae categorías activas con productos activos, ordenados
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        products: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
            badges: true,
            sortOrder: true,
            isActive: true,
          },
        },
      },
    });

    // Puedes devolverlo tal cual o mapearlo
    return categories;
  }
}
