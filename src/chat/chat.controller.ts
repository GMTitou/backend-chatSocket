import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@Controller('/messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/sendMessage')
  async sendMessage(@Request() req, @Body() body) {
    const fromUserId = req.user?.id;
    const { to, message } = body;
    return this.chatService.saveMessage(fromUserId, to, message);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contacts')
  async getContacts(@Request() req) {
    const userId = req.user.id;
    return this.chatService.getContactedUsers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:toId')
  async getMessageHistory(@Request() req, @Param('toId') toId: string) {
    const userId = req.user.id;
    return this.chatService.getMessageHistory(userId, parseInt(toId, 10));
  }
}
