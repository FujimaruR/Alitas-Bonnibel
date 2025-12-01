import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { OrderStatus, OrderType } from '../generated/prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('type') type?: OrderType,
    @Query('tableId') tableId?: string,
  ) {
    return this.ordersService.findAll({
      status,
      type,
      tableId: tableId ? Number(tableId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Patch(':id/pay')
  pay(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PayOrderDto,
  ) {
    return this.ordersService.pay(id, dto);
  }

  // Si quisieras borrar órdenes (no siempre se recomienda)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // aquí podrías implementar this.ordersService.remove(id)
    return { message: 'Not implemented yet' };
  }
}
