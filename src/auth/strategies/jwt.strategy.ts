import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './../auth.service';
import { JwtInput } from './../dto/jwt.input';

/**
 * Our JWT Strategy defines the authentication strategy for GraphQL requests
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the user by providing the JWT Payload
   * @param payload The JWT Input Payload
   * @returns The validated user
   */
  async validate(payload: JwtInput): Promise<User | void> {
    try {
      return await this.authService.validateUserById(payload.userId);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
