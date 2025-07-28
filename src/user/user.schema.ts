import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from 'mongoose'

import * as bcrypt from "bcrypt"



@Schema ({
    timestamps: true,
    versionKey: false
})
export class User extends Document{
    @Prop({
        unique: false,
        type: String,
        required: true,
        minlength: 4,
        maxlength: 10
    })
    name: string

    @Prop({
        unique: true,
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15
    })
    username: string

    @Prop({
        type: String,
        //No se selecciona por defecto cuando se hace un get
        select: false,
        required: true
    })
    password: string
}

export interface UserDocument extends User, Document {
    encryptPassword(password: string): Promise<string>;
    comparePassword(password: string): Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User)


UserSchema.methods.encryptPassword = async function (password: string): Promise<string> {
    const saltOrRounds = 10
    return await bcrypt.hash(password, saltOrRounds);
}

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const resultado = await bcrypt.compare(password, this.password)
    return resultado;
}

