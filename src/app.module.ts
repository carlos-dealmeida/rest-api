import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
