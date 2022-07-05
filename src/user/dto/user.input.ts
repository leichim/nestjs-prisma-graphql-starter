import { Field, InputType, HideField, ID } from '@nestjs/graphql';
import { UserStatus } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UserInput {
  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  id?: string;

  @MinLength(5)
  @IsEmail()
  @Field()
  email?: string;

  @MinLength(16)
  @MaxLength(64)
  @IsString()
  @HideField()
  password?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
