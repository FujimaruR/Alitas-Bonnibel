import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function makeUniqueSlug(prisma: any, base: string) {
  let slug = base;
  let i = 2;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}


@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
  const base = createCategoryDto.slug?.trim() || slugify(createCategoryDto.name);
  const slug = await makeUniqueSlug(this.prisma, base);

  return this.prisma.category.create({
    data: {
      name: createCategoryDto.name,
      slug,
      sortOrder: createCategoryDto.sortOrder ?? 0,
      isActive: createCategoryDto.isActive ?? true,
    },
  });
}


  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Opcional pero útil: validar que existe antes de actualizar
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    // Igualmente, validar existencia
    await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
