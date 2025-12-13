import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * ✅ Bootstrap público: SOLO permite crear el PRIMER usuario ADMIN
   * - Si ya existe 1 usuario, se bloquea.
   * - Úsalo cuando borraste toda tu tabla de users.
   *
   * POST /users/bootstrap-admin
   */
  @Post("bootstrap-admin")
  async bootstrapAdmin(@Body() dto: CreateUserDto) {
    const count = await this.usersService.countUsers();
    if (count > 0) {
      throw new ForbiddenException("Bootstrap deshabilitado: ya existen usuarios");
    }
    if (dto.role !== "ADMIN") {
      throw new ForbiddenException("Bootstrap: el primer usuario debe ser ADMIN");
    }
    return this.usersService.create(dto);
  }

  /**
   * ✅ Crear usuarios normal: SOLO ADMIN
   * POST /users
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /**
   * ✅ Listar usuarios: SOLO ADMIN
   * GET /users
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * ✅ Ver uno: SOLO ADMIN
   * GET /users/:id
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  /**
   * ✅ Actualizar: SOLO ADMIN
   * PATCH /users/:id
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  /**
   * ✅ Eliminar: SOLO ADMIN
   * - Recomendación: evitar que te borres a ti mismo.
   * DELETE /users/:id
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const requesterId = req.user?.id;

    if (requesterId && requesterId === id) {
      throw new ForbiddenException("No puedes eliminar tu propio usuario");
    }

    return this.usersService.remove(id);
  }
}
