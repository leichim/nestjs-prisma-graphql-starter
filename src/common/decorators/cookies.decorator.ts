/**
 * Decorator that can be used to insert cookies into an endpoint
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req;
    return data ? request.cookies?.[data] : request.cookies;
  },
);
