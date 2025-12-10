import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Para no devolver password_hash al frontend
   */
  private sanitizeUser(user: any) {
    if (!user) return user;
    const { password_hash, ...rest } = user;
    return rest;
  }

  async create(createUserDto: CreateUserDto) {
    // Verificar que no exista el email
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Hashear contraseña
    const password_hash = await argon2.hash(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password_hash,
        role: createUserDto.role,
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });

    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * OJO: aquí devolvemos el usuario crudo (con password_hash)
   * porque lo usamos solo para Auth, NO para frontend.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Validar que exista
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: any = { ...updateUserDto };

    // Si viene password, la hasheamos
    if (updateUserDto.password) {
      data.password_hash = await argon2.hash(updateUserDto.password);
      delete data.password; // no existe esta columna en BD
    }

    // Si viene email, validar que no esté repetido en otro usuario
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.sanitizeUser(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    const deleted = await this.prisma.user.delete({
      where: { id },
    });

    return this.sanitizeUser(deleted);
  }
}
