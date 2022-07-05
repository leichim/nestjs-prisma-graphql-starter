import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './../auth.service';
import { JwtInput } from './../dto/jwt.input';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.RefreshingFactors;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  /**
   * Validates the strategy, which is coupled with our guard
   * @param payload The extracted Jwt Payload
   */
  async validate(payload: JwtInput): Promise<User | void> {
    try {
      return await this.authService.validateUserById(payload.userId);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
