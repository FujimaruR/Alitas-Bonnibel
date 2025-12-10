import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, JwtAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
