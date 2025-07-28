import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { privateDecrypt } from 'crypto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) 
        private userModel: Model<UserDocument>,
        
        private jwtService: JwtService,
        private configService: ConfigService
    ){}


    //Register -------- ✅
    async register(data: any): Promise<any> {
        try
        {
            const user = new this.userModel(data);
            const encryptedPassword = await user.encryptPassword(user.password);
            user.password = encryptedPassword;
            await user.save()
            
            return {success: true, msg: "Registro exitoso"};
        }
        catch(e)
        {
            return {success: false, msg: "Error en el registro"}
        }
    }


    //Login -------- ✅
    async login(data: any): Promise<any> {
        try
        {
            const userDatabase = await this.userModel.findOne({username: data.username}).select('+password');
            console.log(userDatabase)
            
            if (!userDatabase) return {success: false, msg: "Username incorrecto"};

            const passwordComparison = await userDatabase.comparePassword(data.password);
            if (!passwordComparison) return {success: false, msg: "Contraseña equivocada"};
            
            const idUser = userDatabase._id!.toString();
            
            const accessJwt = await this.generateAccessToken(idUser, userDatabase.username);
            const refreshJwt = await this.generateRefreshToken(idUser, userDatabase.username);
            

            return {success: true, accessToken: accessJwt, refreshToken: refreshJwt, userId: idUser};
        }
        catch(e)
        {
            return {success: false, msg: "Error al iniciar sesión"}
        }
    }


    async generateAccessToken(userId: string, username: string): Promise<string> {
        const payload = { userId, username };

        const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
        });

        return token;
    }

    async generateRefreshToken(userId: string, username: string): Promise<string> {
        const payload = { sub: userId, username };

        const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '24h',
        });

        return token;
    }

    async validateRefreshToken(refreshToken: string): Promise<any> {
        
        try
        {
            const payload = this.jwtService.verify(
                refreshToken, 
                { secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
            )

            return { success: true, msg: "Refresh token válido", payload }    
        }
        catch(e)
        {
            return { success: false, msg: "Refresh token inválido" }
        }
    }
}
