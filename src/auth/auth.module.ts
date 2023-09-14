import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: undefined,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('EARNIPAY_JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: `${configService.get('EARNIPAY_JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
