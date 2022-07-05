import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { UserInput } from './dto/user.input';

@Resolver('Users')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  async create(@Args('userData') userInput: UserInput) {
    return this.userService.create(userInput);
  }
}
