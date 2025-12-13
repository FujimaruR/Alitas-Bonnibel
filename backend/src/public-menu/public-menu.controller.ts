import { Controller, Get } from "@nestjs/common";
import { PublicMenuService } from "./public-menu.service";

@Controller("public")
export class PublicMenuController {
  constructor(private readonly service: PublicMenuService) {}

  @Get("menu")
  getMenu() {
    return this.service.getMenu();
  }
}
