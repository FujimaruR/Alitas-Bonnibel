import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderDto } from "../orders/dto/create-order.dto";
import { PublicOrdersService } from "./public-orders.service";

@Controller("public")
export class PublicOrdersController {
  constructor(private readonly service: PublicOrdersService) {}

  // Público (sin JWT)
  @Post("orders")
  create(@Body() dto: CreateOrderDto) {
    return this.service.createPublicOrder(dto);
  }
}
