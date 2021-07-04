import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    const jwtToken = await this.getCookie(
      context.args[0].handshake.headers.cookie,
      'jwt',
    );
    try {
      const user = await this.authService.validate(jwtToken);
      if (user) {
        context.switchToWs().getData().user = user;
        return true;
      }
    } catch (ex) {
      return false;
    }
  }

  private getCookie(cookie, name) {
    const parts = cookie?.split(`${name}=`);
    if (parts?.length === 2) return parts.pop().split(';').shift();
  }
}
