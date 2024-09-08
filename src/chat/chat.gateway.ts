import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const user = await this.getUserFromSocket(client);
    if (user) {
      await this.userService.updateIsConnected(user.email, true);
      this.server.emit('updateUsersStatus', {
        userId: user.id,
        isConnected: true,
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getUserFromSocket(client);
    if (user) {
      await this.userService.updateIsConnected(user.email, false);
      console.log(`Client déconnecté : ${client.id}`);
    }
  }

  @SubscribeMessage('Message')
  async handleMessage(
    client: Socket,
    payload: { from: number; to: number; message: string },
  ) {
    await this.chatService.saveMessage(
      payload.from,
      payload.to,
      payload.message,
    );
    this.server.to(payload.to.toString()).emit('message', payload);
  }

  private async getUserFromSocket(client: Socket): Promise<any> {
    try {
      const token = client.handshake?.headers?.authorization;
      if (!token) {
        return null;
      }

      const decoded = this.jwtService.verify(token.split(' ')[1]);
      const user = await this.userService.findOne(decoded.email);
      return user;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return null;
    }
  }
}
