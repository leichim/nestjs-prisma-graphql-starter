import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJWT } from 'graphql-scalars';

@ObjectType()
export class AuthModel {
  @Field(() => GraphQLJWT, { nullable: true })
  accessToken: string;

  @Field(() => GraphQLJWT, { nullable: true })
  refreshToken?: string;

  @Field(() => Number, { nullable: true })
  expiresAt: number;
}
