import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    status?: string;
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const { status, type, from, to, limit = 50 } = params;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = new Date(from);
      if (to) where.created_at.lte = new Date(to);
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: Math.min(limit, 200),
      include: {
        table: true,
        created_by: { select: { id: true, name: true, email: true, role: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true, price: true } },
          },
        },
      },
    });
  }

  async findKitchenBoard() {
    // Cocina normalmente ve: PENDING, IN_PREPARATION, READY
    return this.prisma.order.findMany({
      where: { status: { in: ["PENDING", "IN_PREPARATION", "READY"] } },
      orderBy: { created_at: "asc" },
      include: {
        table: true,
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async updateStatus(orderId: number, dto: UpdateOrderStatusDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
        ...(dto.payment_status ? { payment_status: dto.payment_status } : {}),
        closed_at: dto.status === "SERVED" || dto.status === "CANCELLED" ? new Date() : null,
      },
      include: {
        items: { include: { product: true } },
        table: true,
        created_by: { select: { id: true, name: true } },
      },
    });
  }
}
