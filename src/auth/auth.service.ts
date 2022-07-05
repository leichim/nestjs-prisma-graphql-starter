import { compare as bcryptCompare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserStatus } from '@prisma/client';
import { UserService } from './../user/user.service';
import { PrismaService } from './../prisma/prisma.service';
import { AuthModel } from './models/auth.model';
import { AuthInput } from './dto/auth.input';
import { JwtInput } from './dto/jwt.input';
import { TokenInput } from './dto/token.input';
import { UserModel } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  /**
   * Sign-up a user and set the initial password
   *
   * @param authInput The email and password for a user
   * @returns Promise or nothing
   */
  async signup(authInput: AuthInput): Promise<User | never> {
    try {
      const user = await this.userService.create(authInput);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Login a user and set the JWT token
   * @param user The user as passed after validating
   * @returns Promise with the token or nothing
   */
  async login(user: User): Promise<AuthModel> {
    if (user.status !== UserStatus.ACTIVE) {
      this.userService.updateOne(user, { status: UserStatus.ACTIVE });
    }

    return this.generateTokens({ userId: user.id });
  }

  /**
   * Validates a user upon entering login credentials
   * @param userId The userId for a user
   * @returns Promise or nothing
   */
  async validateUser(authInput: AuthInput): Promise<User | null> {
    const { email, password } = authInput;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    if (user) {
      const match = await bcryptCompare(password, user.password);

      if (!match) {
        return null;
      }
    }

    return user;
  }

  /**
   * Generates access tokens based upon a payload
   * @param payload The payload to sign for
   * @return The authenticated tokens
   */
  private generateTokens(payload: JwtInput): AuthModel {
    return {
      accessToken: this.jwtService.sign(payload),
      expiresAt: Date.now() + +process.env.JWT_EXPIRATION,
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1d',
      }),
    };
  }

  /**
   * Sets the refresh token cookie
   * @todo Add supported domains through domain key
   */
  setRefreshCookie(tokenInput: TokenInput) {
    const { token, response } = tokenInput;

    response?.cookie('RefreshingFactors', token, {
      httpOnly: true,
      maxAge: 24 * 3600000,
    });
  }

  /**
   * Refreshes JWT tokens
   * @param token The JWT refresh token that needs to be verified
   * @returns The authenticated tokens and user ID
   */
  refresh(token: string): AuthModel {
    const { userId } = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    if (!userId) {
      return { accessToken: null, expiresAt: 0, refreshToken: null };
    }

    return this.generateTokens({ userId });
  }

  /**
   * Gets a user by ID for auth purposes, in this case the JWT strategy
   * @param userId The userId for a user
   * @returns Promise or nothing
   */
  async validateUserById(userId: string): Promise<User> {
    return this.userService.findOneById(userId);
  }

  /**
   * Retrieves the current user by the JWT token
   * @param token The JWT token for a user
   * @returns Promise or nothing
   */
  async getUserFromToken(token: string): Promise<UserModel | null> {
    const userId = this.jwtService.decode(token)['userId'];
    const user = await this.userService.findOneById(userId);

    if (!user) {
      return null;
    }

    const { id, email } = user;
    return { id, email };
  }
}
