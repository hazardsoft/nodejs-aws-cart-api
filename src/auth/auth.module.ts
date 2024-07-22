import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { BasicStrategy } from './strategies';

import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../db/prisma.module';
import { BasicAuthGuard } from './guards';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'basic' }),
    PrismaModule,
  ],
  providers: [AuthService, BasicStrategy, BasicAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
