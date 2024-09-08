import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, UserModule, JwtModule.register({})],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
