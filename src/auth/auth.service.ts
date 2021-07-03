import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from '../Modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) {
  }

  async login(userDto: UserDto): Promise<[object, string, boolean]> {
    const user = await this.userService.findOne({ email: userDto.email });
    let asset_token: string = '';
    let isLogin: boolean = false;
    if (user) {
      isLogin = await Bcrypt.compare(userDto.password, user.password);
      if (isLogin) {
        asset_token = this.jwtService.sign({ id: user.id });
      }
    }
    return [user, asset_token, isLogin];
  }

  async validate(jwtToken): Promise<unknown> {
      const payload = await this.jwtService.verify(jwtToken, {secret: "yenbong2912"});
      if(payload){
        return this.userService.findOne({id: payload.id});
      }
  }
}
