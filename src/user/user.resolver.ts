import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { AuthService } from '../auth/auth.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Query(() => String, { name: 'token' })
  async login(@Args() getUserArgs: GetUserArgs): Promise<string> {
    const user = await this.userService.validateUser(getUserArgs._email, getUserArgs._password);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.authService.generateToken({
      email: getUserArgs._email,
      password: getUserArgs._password,
    });
  }

  /**
   * Query to find a User by its email.
   * @returns A Promise that resolves to the found user or null if not found.
   * @param getUserArgs
   */
  @Query(() => User, { name: 'findUserByEmail' })
  async findOne(@Args() getUserArgs: GetUserArgs): Promise<User | null> {
    // Call the service's findOne method to retrieve the Todo item by email
    return this.userService.getUser(getUserArgs._email);
  }
}
