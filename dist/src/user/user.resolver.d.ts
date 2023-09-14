import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GetUserArgs } from './dto/args/get-user-args.dto';
import { AuthService } from '../auth/auth.service';
export declare class UserResolver {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    login(getUserArgs: GetUserArgs): Promise<string>;
    findOne(getUserArgs: GetUserArgs): Promise<User | null>;
}
