import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableStatusDto } from "./dto/update-table-status.dto";

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    // Incluye la última orden “activa” por mesa para que el panel muestre contexto
    return this.prisma.table.findMany({
      orderBy: { id: "asc" },
      include: {
        orders: {
          where: { status: { in: ["PENDING", "IN_PREPARATION", "READY"] } },
          orderBy: { created_at: "desc" },
          take: 1,
          include: {
            items: { include: { product: { select: { name: true } } } },
          },
        },
      },
    });
  }

  create(dto: CreateTableDto) {
    return this.prisma.table.create({
      data: {
        name: dto.name,
        status: (dto.status ?? "FREE") as any,
      },
    });
  }

  async updateStatus(id: number, dto: UpdateTableStatusDto) {
    const t = await this.prisma.table.findUnique({ where: { id } });
    if (!t) throw new NotFoundException("Mesa no encontrada");

    return this.prisma.table.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  remove(id: number) {
    return this.prisma.table.delete({ where: { id } });
  }
}
