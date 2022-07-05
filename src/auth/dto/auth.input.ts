import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class AuthInput {
  @MinLength(5)
  @IsEmail()
  @Field()
  email: string;

  @MinLength(16)
  @MaxLength(64)
  @IsString()
  @Field()
  password: string;
}
