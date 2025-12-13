import { Controller, Get, Query } from "@nestjs/common";
import { PublicMenuService } from "./public-menu.service";

@Controller("public")
export class PublicMenuController {
  constructor(private readonly service: PublicMenuService) {}

  @Get("categories")
  categories() {
    return this.service.categories();
  }

  @Get("products")
  products(@Query("categorySlug") categorySlug?: string) {
    return this.service.products(categorySlug);
  }

  @Get("menu")
  menu() {
    return this.service.menu();
  }
}
