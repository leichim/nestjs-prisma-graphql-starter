import { genSalt, hash } from 'bcrypt';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInput } from './dto/user.input';
import { User } from '.prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user after sign-up
   * @param userSignupData The email and password for a user
   * @returns Promise
   */
  async create(userInput: UserInput): Promise<User | never> {
    const { email, password } = userInput;
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        throw new ConflictException('USER_EXISTING');
      } else {
        throw new InternalServerErrorException('SERVER_ERROR');
      }
    }
  }

  /**
   * Update the user status by email
   */
  async updateOne(user: User, data: UserInput): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    });
  }

  /**
   * Retrieve the user by email
   */
  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /**
   * Retrieve the user by id
   */
  async findOneById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
