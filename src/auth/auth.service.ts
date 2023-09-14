import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/entities/user.entity.js';

export interface TokenPayload {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async generateToken(user: User, response?: Response) {
    const tokenPayload: TokenPayload = {
      email: user.email,
    };

    return this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('EARNIPAY_JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('EARNIPAY_JWT_EXPIRATION')}s`,
    });
  }
}
