import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('')
  async testRequest(
    @Res() res:Response
  ) 
  {
    return res.status(200).json({msg: "Server 3 On"})
  }



  @Post('user/login')
  async login(
    //Request
    @Body() data: any,
    //Response
    @Res() res: Response
  ) 
  {
    try
    {
      if (!data.username || !data.password) return res.status(203).json({msg: "Debe enviar todos los datos para iniciar sesión"})
      

      const resultado = await this.userService.login(data);

      if (resultado.success === false) return res.status(203).json({msg: resultado.msg})
      
      //Envío del refresh token en una cookie
      res.cookie('refreshToken', resultado.refreshToken, {
        httpOnly: true,
        secure: false,  // --------------------------------------------- CAMBIAR ANTES DE DESPLIEGUE
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24
      });
      
      const { accessToken, userId } = resultado;

      //Respuesta
      return res.status(200).json({accessToken, userId})
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al iniciar sesión"})
    }
  }






  @Post('user/register')
  async register(
    @Body() data: any,
    @Res() res: Response
  )
  {
    try
    {
      if (!data.name || !data.username || !data.password) return res.status(203).json({msg: "Debe enviar todos los datos"});

      const resultado = await this.userService.register(data);
      
      if (resultado.success === false) return res.status(203).json({msg: "Error al registrarse"})

      return res.status(200).json({msg: "Se ha registrado exitosamente"})
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al registrarse"})
    }
  }






  @Get('user/newAccessToken')
  async generateNewAccessToken(
    @Req() req:Request,
    @Res() res:Response
  ) 
  {
    try
    {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) return res.status(203).json({msg: "Refresh token no enviada"});
      const resultado = await this.userService.validateRefreshToken(refreshToken);

      if (resultado.success === false) return res.status(203).json({msg: resultado.msg});

      const newAccessToken = await this.userService.generateAccessToken(resultado.payload.userId, resultado.payload.username)
      
      return res.status(200).json({accessToken: newAccessToken, userId: resultado.payload.userId});
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al generar un nuevo access token"})
    }
  }

  @Get('user/logout')
  async logout(
    @Res() res:Response,
    @Req() req:Request
  )
  {
    try
    {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) return res.status(203).json({msg: "Refresh token no enviada"});
      res.clearCookie("refreshToken");
      return res.status(200).json({msg: "Cierre de sesión exitoso"});
    }
    catch(e)
    {
      return res.status(500).json({msg: "Error al cerrar sesión"});
    } 
  }
}