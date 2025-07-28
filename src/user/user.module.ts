import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],


  imports: [

    ConfigModule,

    MongooseModule.forFeature([{
      name: User.name, schema: UserSchema
      }
    ]),

    AuthModule,

    JwtModule.register({})
  ]
})
export class UserModule {}
