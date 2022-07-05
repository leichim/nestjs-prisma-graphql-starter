import { ArgsType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class JwtInput {
  @IsUUID()
  userId: string;
}
