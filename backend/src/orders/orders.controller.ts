import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  // ADMIN: lista general con filtros
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  list(
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("limit") limit?: string
  ) {
    return this.service.findAll({
      status,
      type,
      from,
      to,
      limit: limit ? Number(limit) : 50,
    });
  }

  // KITCHEN (y ADMIN): tablero cocina
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("KITCHEN", "ADMIN")
  @Get("kitchen")
  kitchenBoard() {
    return this.service.findKitchenBoard();
  }

  // KITCHEN (y ADMIN): actualizar estatus
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
