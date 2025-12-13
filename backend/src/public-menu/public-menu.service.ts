import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PublicMenuService {
  constructor(private prisma: PrismaService) {}

  async categories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    });
  }

  async products(categorySlug?: string) {
    const where: any = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug, isActive: true };
    }

    return this.prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        badges: true,
        category: { select: { id: true, slug: true, name: true } },
      },
    });
  }

  async menu() {
    const categories = await this.categories();
    const products = await this.products();

    // agrupar
    const grouped = categories.map((c) => ({
      ...c,
      products: products.filter((p) => p.category.slug === c.slug),
    }));

    return grouped;
  }
}
