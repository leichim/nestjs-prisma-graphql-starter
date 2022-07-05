import { Query, Resolver } from '@nestjs/graphql';
import { Public } from './common/decorators/public.decorator';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @Public()
  welcome(): string {
    return 'Welcome!';
  }

  @Query(() => String)
  goodbye(): string {
    return 'Goodbye!';
  }
}
