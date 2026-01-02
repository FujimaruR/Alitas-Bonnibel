import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "../orders/dto/create-order.dto";

@Injectable()
export class PublicOrdersService {
  constructor(private prisma: PrismaService) {}

  async createPublicOrder(dto: CreateOrderDto) {
    // 0) obtener usuario "SYSTEM" (creado por seed)
    const systemEmail = process.env.PUBLIC_ORDER_USER_EMAIL || "system@alitas.local";

    const systemUser = await this.prisma.user.findUnique({
      where: { email: systemEmail },
      select: { id: true },
    });

    if (!systemUser) {
      throw new BadRequestException(
        `No existe el usuario SYSTEM (${systemEmail}). Ejecuta el seed o crea ese usuario.`
      );
    }

    // 1) normalizar productIds (acepta "p-13" o 13)
    const productIds = dto.items.map((x: any) => {
      const raw = x.productId;
      if (typeof raw === "number") return raw;
      if (typeof raw === "string") {
        const n = Number(raw.replace(/^p-/, ""));
        if (!Number.isFinite(n)) throw new BadRequestException(`productId inválido: ${raw}`);
        return n;
      }
      throw new BadRequestException(`productId inválido: ${raw}`);
    });

    // 2) traer productos activos
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, price: true, name: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException("Uno o más productos no existen o están inactivos");
    }

    const byId = new Map(products.map((p) => [p.id, p]));

    // 3) construir items + total
    const itemsCreate = dto.items.map((x: any) => {
      const pid =
        typeof x.productId === "number"
          ? x.productId
          : Number(String(x.productId).replace(/^p-/, ""));

      const prod = byId.get(pid)!;
      const qty = Number(x.quantity);

      if (!Number.isFinite(qty) || qty < 1) {
        throw new BadRequestException(`quantity inválido para productId ${x.productId}`);
      }

      const unit = prod.price;
      const subtotal = unit * qty;

      return {
        product_id: pid,
        quantity: qty,
        unit_price: unit,
        subtotal,
      };
    });

    const total = itemsCreate.reduce((acc, it) => acc + it.subtotal, 0);

    // 4) crear orden (modo Unchecked: usar created_by_user_id)
    return this.prisma.order.create({
      data: {
        type: dto.type,
        total_amount: total,
        table_id: dto.table_id ?? null,
        created_by_user_id: systemUser.id,
        items: { create: itemsCreate },
      },
      include: {
        table: true,
        items: { include: { product: true } },
      },
    });
  }
}
