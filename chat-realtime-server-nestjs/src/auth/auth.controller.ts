import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { ForgotpassDto } from './dto/forgotpass.dto';

@Controller('auth')

export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signin')
  async login(@Body() userDto: UserDto, @Res() res: Response): Promise<Response> {
    const [user, asset_token, isLogin] = await this.authService.login(userDto);
    if (isLogin) {
      res.cookie("jwt", asset_token, {maxAge: 600000, httpOnly: true});
        return res.status(200).header({
        asset_token,
      }).json({ user, asset_token });
    } else {
      return res.status(404).json({
        message: 'username or password invalid',
      });
    }
  }

  // @Post("forgotPassword")
  // async forgotPassword(@Body() fp: ForgotpassDto, @Res() res: Response): Promise<Response>{
  //     const user = this.authService
  // }

}
