import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose";



export type Category = 'limpieza' | 'hogar' | 'tecnología' | 'electrodomésticos' | 'salud'

@Schema({
    timestamps: true,
    versionKey: false
})
export class Product extends Document {

    @Prop({
        type: String,
        required: true,
        maxlength: 50
    })
    name: string

    @Prop({
        type: String,
        required: true,
        unique: true,
        
        length: 4
    })
    code: string

    @Prop({
        type: String,
        required: true
    })
    description: string

    @Prop({
        type: String,
        enum: ['limpieza', 'hogar', 'tecnología', 'electrodomésticos', 'salud'],
        maxlength: 200,
        required: true
    })
    category: Category

    @Prop({
        required: true
    })
    price: number

    @Prop({
        required: true
    })
    stock: number
}

export const ProductSchema = SchemaFactory.createForClass(Product);
