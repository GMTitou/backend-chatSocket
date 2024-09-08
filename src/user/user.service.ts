import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData: {
    fullname: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      },
    });
  }

  async findUserByFullName(fullname: string) {
    return this.prisma.user.findFirst({
      where: {
        fullname: {
          contains: fullname,
          mode: 'insensitive',
        },
      },
    });
  }

  async updateIsConnected(email: string, isConnected: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { isConnected },
    });
  }
}
