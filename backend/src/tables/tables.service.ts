import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  async findAll() {
    return this.prisma.table.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  async updateStatus(id: number, dto: UpdateTableStatusDto) {
    await this.findOne(id);

    return this.prisma.table.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.table.delete({
      where: { id },
    });
  }
}
