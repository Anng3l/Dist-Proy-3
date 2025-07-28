import { Body, Controller, Delete, Get, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response, response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async postProduct(
    //Cuerpo de la request
    @Body() data: any,
    //Respuesta a la request
    @Res() res:Response
  ) 
  {
    try
    {
      const { name, code, description, category, price, stock } = data;

      if (
        typeof name !== 'string' || name.trim().length === 0 || name.length > 50 ||
        typeof code !== 'string' || code.length !== 4 ||
        typeof description !== 'string' || description.length < 10 || description.length > 200 ||
        typeof category !== 'string' || !['limpieza', 'hogar', 'tecnología', 'electrodomésticos', 'salud'].includes(category) ||
        typeof price !== 'number' || isNaN(price) || price < 0 ||
        typeof stock !== 'number' || isNaN(stock) || stock < 0
      ) 
      {
        return res.status(400).json({ msg: 'Datos inválidos o campos fuera de rango' });
      }
      
      const resultado = await this.productService.createProduct(data);
      
      if (resultado.success === false) return res.status(203).json({msg: resultado.msg});

      return res.status(200).json({msg: "Producto creado satisfactoriamente"});
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al crear un producto"});
    }

  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async updateProduct(
    @Body() data: any,
    @Res() res:Response
  ) 
  {
    try
    {
      const resultado = await this.productService.updateProduct(data);

      if (resultado.success === false) return res.status(203).json({msg: resultado.msg});

      return res.status(200).json({msg: "Producto actualizado exitosamente"});
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error actualizando un producto"});
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('one')
  async getOneProduct(
    @Body() code:any,
    @Res() res:Response
  ) 
  {
    try
    {
      const resultado = await this.productService.getOneProduct(code.code);
      if (resultado.success === false) return res.status(203).json({msg: resultado.msg});

      return res.status(200).json(resultado);
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al listar un producto"})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllProducts(
    @Res() res:Response
  )
  {
    try
    {
      const products = await this.productService.getAllProducts();
      return res.status(200).json(products);
    }
    catch(e)
    {
      return res.status(203).json({msg: "Error al listar todos los productos"})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async deleteOneProduct(
    @Body() code:any,
    @Res() res:Response
  ) 
  {
    try
    {
      if (!code.code) return res.status(203).json({msg: "Debe enviar el código del producto a eliminar"})
      const resultado = await this.productService.deleteOneProduct(code.code);
      if (resultado.success === false) return res.status(203).json({msg: resultado.msg});

      return res.status(200).json({msg: "Producto eliminado exitosamente"});
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al eliminar un producto"})
    }
  }
}
