import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Server, Socket } from 'socket.io';
import type { MessageResponse } from '@repo/shared';
import type { JwtPayload } from '../auth/interfaces/auth.interfaces';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/ws/messages',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = this.extractToken(client);
      const secret = this.configService.getOrThrow<string>('auth.jwtSecret');
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });

      client.data.userId = payload.sub;
      await client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(_client: Socket): void {
    // socket.io automatically leaves all rooms on disconnect
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { receiverId: string },
  ): void {
    if (typeof body?.receiverId !== 'string') return;
    const senderId = client.data.userId as string | undefined;
    if (!senderId) return;
    this.server.to(`user:${body.receiverId}`).emit('user_typing', { userId: senderId, isTyping: true });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { receiverId: string },
  ): void {
    if (typeof body?.receiverId !== 'string') return;
    const senderId = client.data.userId as string | undefined;
    if (!senderId) return;
    this.server.to(`user:${body.receiverId}`).emit('user_typing', { userId: senderId, isTyping: false });
  }

  emitNewMessage(receiverId: string, message: MessageResponse): void {
    this.server.to(`user:${receiverId}`).emit('new_message', message);
  }

  emitThreadRead(originalSenderId: string, byUserId: string): void {
    this.server.to(`user:${originalSenderId}`).emit('thread_read', { byUserId });
  }

  private extractToken(client: Socket): string {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    const tokenFromAuth = (client.handshake.auth as Record<string, unknown>)?.token;
    if (typeof tokenFromAuth === 'string' && tokenFromAuth.length > 0) {
      return tokenFromAuth;
    }

    throw new Error('No token provided');
  }
}
