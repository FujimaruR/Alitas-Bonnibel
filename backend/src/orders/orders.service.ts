import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    OrderStatus,
    OrderType,
    PaymentStatus,
    TableStatus,
    Prisma,
} from '../generated/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PayOrderDto } from './dto/pay-order.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateOrderDto) {
        // 1) Si es DINE_IN, validar mesa
        let tableId: number | undefined = dto.table_id;

        if (dto.type === OrderType.DINE_IN) {
            if (!dto.table_id) {
                throw new BadRequestException('table_id is required for DINE_IN orders');
            }

            const table = await this.prisma.table.findUnique({
                where: { id: dto.table_id },
            });

            if (!table) {
                throw new NotFoundException('Table not found');
            }

            tableId = table.id;
        }

        // 2) Validar items y obtener precios
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('Order must have at least one item');
        }

        const itemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];
        let totalAmount = 0;

        for (const item of dto.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.product_id },
            });

            if (!product) {
                throw new NotFoundException(
                    `Product with id ${item.product_id} not found`,
                );
            }

            const unitPrice = product.price;
            const subtotal = unitPrice * item.quantity;
            totalAmount += subtotal;

            itemsData.push({
                product: {          // 👈 se conecta por relación
                    connect: { id: item.product_id },
                },
                quantity: item.quantity,
                unit_price: unitPrice,
                subtotal,
                notes: item.notes,
            });
        }

        const user = await this.prisma.user.findUnique({
            where: { id: dto.created_by_user_id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }


        // 3) Crear la orden con los items anidados
        const order = await this.prisma.order.create({
            data: {
                type: dto.type,
                status: OrderStatus.PENDING,
                payment_status: PaymentStatus.UNPAID,
                total_amount: totalAmount,
                table_id: tableId,
                created_by_user_id: dto.created_by_user_id,
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
                table: true,
            },
        });


        // 4) Si es DINE_IN, marcar la mesa como OCCUPIED
        if (dto.type === OrderType.DINE_IN && tableId) {
            await this.prisma.table.update({
                where: { id: tableId },
                data: {
                    status: TableStatus.OCCUPIED,
                },
            });
        }

        return order;
    }

    async findAll(params?: {
        status?: OrderStatus;
        type?: OrderType;
        tableId?: number;
    }) {
        const where: any = {};

        if (params?.status) where.status = params.status;
        if (params?.type) where.type = params.type;
        if (params?.tableId) where.table_id = params.tableId;

        return this.prisma.order.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                items: { include: { product: true } },
                table: true,
            },
        });
    }

    async findOne(id: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                table: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(id: number, dto: UpdateOrderStatusDto) {
        const order = await this.findOne(id);

        const updated = await this.prisma.order.update({
            where: { id },
            data: {
                status: dto.status,
                // Si se marca como SERVED o CANCELLED podrías cerrar la orden, etc.
            },
            include: {
                items: { include: { product: true } },
                table: true,
            },
        });

        // Si la orden es de mesa y se sirve o cancela, podríamos liberar la mesa
        if (
            order.type === OrderType.DINE_IN &&
            order.table_id &&
            (dto.status === OrderStatus.SERVED ||
                dto.status === OrderStatus.CANCELLED)
        ) {
            await this.prisma.table.update({
                where: { id: order.table_id },
                data: {
                    status: TableStatus.FREE,
                },
            });
        }

        return updated;
    }

    async pay(id: number, dto: PayOrderDto) {
        const order = await this.findOne(id);

        // Si mandan total_amount, lo usamos; si no, mantenemos el calculado
        const totalAmount = dto.total_amount ?? order.total_amount;

        return this.prisma.order.update({
            where: { id },
            data: {
                payment_status: dto.payment_status,
                total_amount: totalAmount,
                closed_at:
                    dto.payment_status === PaymentStatus.PAID ||
                        dto.payment_status === PaymentStatus.REFUNDED
                        ? new Date()
                        : order.closed_at,
            },
            include: {
                items: { include: { product: true } },
                table: true,
            },
        });
    }
}
