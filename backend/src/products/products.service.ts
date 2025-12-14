import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

interface FindAllOptions {
  categoryId?: number;
  onlyAvailable?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        categoryId: createProductDto.categoryId,
        name: createProductDto.name,
        description: createProductDto.description ?? null,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl,
        badges: createProductDto.badges ?? [],
        isActive: true,
        isFeatured: false, // ✅ opcional, pero explícito
        sortOrder: 0,
      },
    });
  }

  async findAll(options: FindAllOptions = {}) {
    const where: any = {};

    if (options.categoryId !== undefined) {
      where.categoryId = options.categoryId; // ✅
    }

    if (options.onlyAvailable === true) {
      where.isActive = true; // ✅
    }

    return this.prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) throw new NotFoundException("Category not found");
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto, // ✅ aquí sí pasa isFeatured
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
