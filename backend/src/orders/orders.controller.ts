import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) { }

  /**
   * ADMIN: dashboard summary
   * (Ponlo arriba de rutas con params para evitar choques)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("dashboard")
  dashboard() {
    return this.service.getDashboardSummary();
  }

  /**
   * KITCHEN (y ADMIN): tablero cocina
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("KITCHEN", "ADMIN")
  @Get("kitchen")
  kitchenBoard() {
    return this.service.findKitchenBoard();
  }

  /**
   * ✅ Crear orden desde panel (ADMIN/WAITER)
   * - Usa req.user.id para created_by_user_id
   * - Acepta table_id cuando type === DINE_IN
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "WAITER")
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  /**
   * ADMIN: lista general con filtros
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "WAITER", "KITCHEN")
  @Get()
  list(
    @Req() req: any,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("limit") limit?: string
  ) {
    const role = req.user?.role as string;

    // ADMIN puede filtrar libre
    if (role === "ADMIN") {
      return this.service.findAll({
        status,
        type,
        from,
        to,
        limit: limit ? Number(limit) : 50,
      });
    }

    // WAITER/KITCHEN: lista "operativa" por defecto
    // - solo activas, a menos que manden status explícito
    const operationalStatus = status ?? "ACTIVE";

    return this.service.findAll({
      status: operationalStatus,
      type,
      from,
      to,
      limit: limit ? Number(limit) : 50,
    });
  }


  /**
   * KITCHEN (y ADMIN): actualizar estatus
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("KITCHEN", "ADMIN")
  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.service.updateStatus(id, dto);
  }
}
