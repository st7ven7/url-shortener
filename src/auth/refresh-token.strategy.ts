import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
 
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,

      passReqToCallback: true,

    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {

    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
 
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.usersService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return { id: user.id, email: user.email, refreshToken };
  }
}