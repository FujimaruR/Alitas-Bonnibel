import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CreateOrderDto } from "./dto/create-order.dto";


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async findAll(params: {
    status?: string;
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const { status, type, from, to, limit = 50 } = params;

    const where: any = {};

    if (status) {
      if (status === "ACTIVE") {
        where.status = { in: ["PENDING", "IN_PREPARATION", "READY"] };
      } else {
        where.status = status;
      }
    }

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
    // 1) Traer la orden actual para ver si tiene mesa
    const current = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, table_id: true, status: true },
    });

    if (!current) {
      throw new BadRequestException("Orden no encontrada");
    }

    const shouldClose = dto.status === "SERVED" || dto.status === "CANCELLED";

    // 2) Actualizar orden
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: dto.status,
        ...(dto.payment_status ? { payment_status: dto.payment_status } : {}),
        closed_at: shouldClose ? new Date() : null,
      },
      include: {
        items: { include: { product: true } },
        table: true,
        created_by: { select: { id: true, name: true } },
      },
    });

    // 3) Si se cerró y tenía mesa: liberar mesa
    if (shouldClose && current.table_id) {
      await this.prisma.table.update({
        where: { id: current.table_id },
        data: { status: "FREE" as any },
      });
    }

    return updated;
  }


  async getDashboardSummary() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [todayCount, todayAgg, byStatus, recent] = await Promise.all([
      this.prisma.order.count({
        where: { created_at: { gte: start, lte: end } },
      }),
      this.prisma.order.aggregate({
        where: { created_at: { gte: start, lte: end } },
        _sum: { total_amount: true },
        _avg: { total_amount: true },
      }),
      this.prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: { created_at: { gte: start, lte: end } },
      }),
      this.prisma.order.findMany({
        orderBy: { created_at: "desc" },
        take: 10,
        include: {
          table: true,
          items: { include: { product: { select: { name: true } } } },
          created_by: { select: { name: true, role: true } },
        },
      }),
    ]);

    const revenue = todayAgg._sum.total_amount ?? 0;
    const avgTicket = todayAgg._avg.total_amount ?? 0;

    const statusCounts = {
      PENDING: 0,
      IN_PREPARATION: 0,
      READY: 0,
      SERVED: 0,
      CANCELLED: 0,
    } as Record<string, number>;

    for (const row of byStatus) {
      statusCounts[row.status] = row._count._all;
    }

    return {
      today: {
        orders: todayCount,
        revenue,
        avgTicket,
      },
      statusCounts,
      recentOrders: recent,
    };
  }

  async create(dto: CreateOrderDto, createdByUserId: number) {
    if (!dto.items?.length) {
      throw new BadRequestException("La orden debe tener items");
    }

    const isDineIn = dto.type === "DINE_IN";

    // 1) Validar mesa si es DINE_IN
    let tableIdToUse: number | null = null;

    if (isDineIn) {
      if (!dto.table_id) {
        throw new BadRequestException("Para DINE_IN debes enviar table_id");
      }

      const table = await this.prisma.table.findUnique({
        where: { id: dto.table_id },
      });

      if (!table) throw new BadRequestException("La mesa no existe");

      tableIdToUse = dto.table_id;
    }

    // 2) Traer productos y calcular total
    const productIds = dto.items.map((x) => x.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, price: true, name: true },
    });

    const priceById = new Map(products.map((p) => [p.id, p.price]));

    // Validar que todos existan
    for (const it of dto.items) {
      if (!priceById.has(it.productId)) {
        throw new BadRequestException(`Producto inválido o inactivo: ${it.productId}`);
      }
    }

    // itemsData (lo que Prisma necesita)
    const itemsData = dto.items.map((it) => {
      const unit = priceById.get(it.productId)!;
      const subtotal = unit * it.quantity;
      return {
        product_id: it.productId,
        quantity: it.quantity,
        unit_price: unit,
        subtotal,
      };
    });

    const total = itemsData.reduce((acc, x) => acc + x.subtotal, 0);

    // 3) Crear orden
    const order = await this.prisma.order.create({
      data: {
        type: dto.type,
        table_id: tableIdToUse,
        total_amount: total,
        created_by_user_id: createdByUserId, // ✅ tu schema lo requiere

        // customerName aún no existe en Prisma schema que pegaste, así que NO lo guardo aquí
        // si luego lo quieres, hay que agregarlo al schema y migrar

        items: { create: itemsData },
      },
      include: {
        table: true,
        created_by: { select: { id: true, name: true, email: true, role: true } },
        items: { include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } } },
      },
    });

    // 4) Marcar mesa OCCUPIED si aplica
    if (order.table_id) {
      await this.prisma.table.update({
        where: { id: order.table_id },
        data: { status: "OCCUPIED" as any },
      });
    }

    return order;
  }

}
