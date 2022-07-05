import { InputType, Field } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty, IsOptional } from 'class-validator';
import { Response } from 'express';
import { GraphQLJWT } from 'graphql-scalars';

@InputType()
export class TokenInput {
  @IsNotEmpty()
  @IsJWT()
  @Field(() => GraphQLJWT)
  token: string;

  @IsOptional()
  response?: Response;
}
