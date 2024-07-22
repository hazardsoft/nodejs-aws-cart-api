import { Injectable } from '@nestjs/common';

import { User, UserDto } from '../models';
import { PrismaService } from '../../db/prisma.service';
import { UserId } from '../../shared/types';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(userId: UserId): Promise<User> {
    return plainToClass(User, await this.prismaService.findUserByName(userId));
  }

  async createOne(user: UserDto): Promise<User> {
    return plainToClass(User, await this.prismaService.createUser(user));
  }
}
