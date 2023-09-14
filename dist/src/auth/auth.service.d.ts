import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/entities/user.entity.js';
export interface TokenPayload {
    email: string;
}
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    constructor(configService: ConfigService, jwtService: JwtService);
    generateToken(user: User, response?: Response): Promise<string>;
}
