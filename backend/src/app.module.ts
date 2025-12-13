import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PublicMenuModule } from "./public-menu/public-menu.module";


@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    ProductsModule,
    TablesModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    PublicMenuModule,
  ],
})
export class AppModule {}
