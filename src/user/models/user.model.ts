import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  email: string;
}
