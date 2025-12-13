import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface FindAllOptions {
  categoryId?: number;
  onlyAvailable?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        categoryId: createProductDto.categoryId,
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl,
        badges: createProductDto.badges ?? [],
        isActive: true,
        sortOrder: 0,
      },
    });
  }


  async findAll(options: FindAllOptions = {}) {
    const where: any = {};

    if (options.categoryId !== undefined) {
      where.category_id = options.categoryId;
    }

    if (options.onlyAvailable === true) {
      where.is_available = true;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      include: {
        category: true, // para que el frontend tenga nombre de categoría
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Validar que el producto exista
    await this.findOne(id);

    // Si viene un category_id nuevo, validar que exista esa categoría
    if (updateProductDto.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    // Validar que exista
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
