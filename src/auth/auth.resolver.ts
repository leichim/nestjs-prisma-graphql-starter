import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Context } from '@nestjs/graphql';
import { UserStatus } from '@prisma/client';
import { Request } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './../common/decorators/public.decorator';
import { UserModel } from './../user/models/user.model';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthModel } from './models/auth.model';
import { TokenInput } from './dto/token.input';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a user
   * @param authInput The username and password for the given user
   * @returns
   */
  @Public()
  @Mutation(() => UserModel)
  async register(@Args('data') authInput: AuthInput) {
    try {
      return await this.authService.signup(authInput);
    } catch (error) {
      throw new Error('AUTH_REGISTRATION');
    }
  }

  /**
   * Login a user and sets the refreshtoken as a cookie
   *
   * @param authInput The credentials for logging in
   * @param response The response from the server
   * @returns The acesstoken
   */
  @Public()
  @Mutation(() => AuthModel)
  async login(
    @Args('data') authInput: AuthInput,
    @Context('req') request: Request,
  ) {
    const user = await this.authService.validateUser(authInput);

    if (!user) {
      throw new UnauthorizedException('AUTH_CREDENTIALS');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('AUTH_INACTIVE');
    }

    // Retrieve the accessToken and refreshToken, and set the Refreshcookie
    const { accessToken, expiresAt, refreshToken } =
      await this.authService.login(user);

    this.authService.setRefreshCookie({
      token: refreshToken,
      response: request.res,
    });

    return { accessToken, expiresAt };
  }

  /**
   * Logout a user by clearing the refresh cookies
   */
  @Query(() => AuthModel)
  logout(@Context('req') request: Request) {
    request.res?.clearCookie('RefreshingFactors');

    return { accessToken: null, expiresAt: 0 };
  }

  /**
   * Refreshes our token, which also needs to work when our regular Jwt is invaled
   * The refresh token is stored in a cookie, an needs to be retrieved from the cookies in the request
   *
   * The GqlJwtFreshGuard ensures we have a valid refresh token
   *
   * @returns AuthModel The updated accessToken
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Query(() => AuthModel)
  async refresh(@Context('req') request: Request) {
    const token = request?.cookies?.RefreshingFactors;
    const { accessToken, expiresAt, refreshToken } =
      this.authService.refresh(token);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    this.authService.setRefreshCookie({
      token: refreshToken,
      response: request.res,
    });

    return { accessToken, expiresAt };
  }

  /**
   * Returns the user associated from the JWT token
   * @param token The JWT token
   * @returns The user, if any
   */
  @Query(() => UserModel)
  async user(@Args('data') tokenInput: TokenInput) {
    const user = await this.authService.getUserFromToken(tokenInput.token);

    if (!user) {
      throw new UnauthorizedException('AUTH_TOKEN');
    }

    return user;
  }
}
