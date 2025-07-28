import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],


  imports: [
    MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema }
      ]
    ),

    AuthModule
  ]
})
export class ProductModule {}
