import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { testUser } from '../stubs/todo.stub';

export class E2eTestManager {
  public httpServer: any;

  private app: INestApplication;
  private accessToken: string;
  public prismaService: PrismaService;
  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();
    this.httpServer = this.app.getHttpServer();

    const authService = this.app.get<AuthService>(AuthService);
    this.prismaService = moduleRef.get<PrismaService>(PrismaService);
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        email: testUser.email,
      },
    });
    this.accessToken = await authService.generateToken({
      ...testUser,
      email: user.email,
    });
  }

  async afterAll() {
    await this.app.close();
  }

  getCollection(todoId: number) {
    return this.prismaService.todo.findUniqueOrThrow({
      where: {
        id: todoId,
      },
    });
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
