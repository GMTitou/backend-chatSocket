import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(fromId: number, toId: number, message: string) {
    return this.prisma.message.create({
      data: {
        fromId,
        toId,
        message,
      },
    });
  }

  async getContactedUsers(userId: number): Promise<any> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { sentMessages: { some: { toId: userId } } },
          { receivedMessages: { some: { fromId: userId } } },
        ],
      },
      select: {
        id: true,
        fullname: true,
      },
    });
    return users;
  }

  async getMessageHistory(userId: number, toId: number): Promise<any> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { fromId: userId, toId: toId },
          { fromId: toId, toId: userId },
        ],
      },
      orderBy: { createAt: 'asc' },
    });
  }
}
