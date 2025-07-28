import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {

    constructor (
        @InjectModel(Product.name) 
        private productModel: Model<Product>
    ) {}

    async createProduct(data:any): Promise<any> {
        try
        {
            const uniqueCode = await this.productModel.findOne({code: data.code});
            if (uniqueCode) return {success: false, msg: "Código ya existente"}
            
            const product = new this.productModel(data);
            
            await product.save();
            
            return {success: true, msg: "Producto creado exitosamente"}
        }
        catch(e)
        {
            console.error("Error en el servicio createProduct: ", e)
            return {success: false, msg: "Error al crear un producto"}
        }
    }



    async updateProduct(data:any): Promise<any> {
        try
        {
            const updated = await this.productModel.findOneAndUpdate({code:data.code}, {$set: data}, {new: true})

            if (!updated) return {success: false, msg: "No se pudieron actualizar los productos"}

            return {success: true, msg: "Producto actualizado exitosamente"}
        }
        catch(e)
        {
            return {success: false, msg: "Error actualizando un producto"}
        }
    }



    async getOneProduct(code:string): Promise<any> {
        try
        {
            const producto = await this.productModel.findOne({code: code});
            if (!producto) return { success: false, msg: "Error al buscar un producto" }

            return producto;
        }
        catch(e)
        {
            return {success: false, msg: "Error al listar un producto"}
        }
    }


    async getAllProducts(): Promise<any> {
        try
        {
            const productos = await this.productModel.find();

            return productos;
        }
        catch(e)
        {
            return {success: false, msg: "Error al listar todos los productos"}
        }
    }

    async deleteOneProduct(code:string): Promise<any> {
        try
        {
            const resultado = await this.productModel.deleteOne({code: code})
            if (resultado.deletedCount === 0) return { success: false, msg: "Error al eliminar un producto" }

            return { success: true, msg: "Producto eliminado exitosamente" }
        }
        catch(e)
        {
            return { success: false, msg: "Error al eliminar un producto" }
        }
    }
}
