import { Body, Controller, Get, Patch, Post, Query, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { AdminMenuService } from "./admin-menu.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin")
export class AdminMenuController {
  constructor(private readonly service: AdminMenuService) {}

  @Get("categories")
  categories() {
    return this.service.listCategories();
  }

  @Post("categories")
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get("products")
  products(@Query("categoryId") categoryId?: string) {
    return this.service.listProducts(categoryId ? Number(categoryId) : undefined);
  }

  @Post("products")
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Patch("products/:id")
  updateProduct(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.updateProduct(id, dto);
  }
}
