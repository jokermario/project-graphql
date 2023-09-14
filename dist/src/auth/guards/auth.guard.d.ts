import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
export declare class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
    validateToken(auth: string): Promise<string | jwt.JwtPayload>;
}
