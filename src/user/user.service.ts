import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve a single user by Email.
   * @returns The requested user.
   * @throws NotFoundException if the user with the given Email does not exist.
   * @param email
   */
  async getUser(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          email: email,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle not found error
        if (e.code === 'P2025') {
          throw new NotFoundException(`The user with email: ${email} does not exist`);
        }
      }
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
