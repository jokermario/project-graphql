import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(email: string): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
}
