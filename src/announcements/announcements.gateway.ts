import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { Announcement } from './announcement.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
})
export class AnnouncementsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private configService: ConfigService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyAnnouncementCreated(announcement: Announcement) {
    this.server.emit('announcement:created', {
      ...announcement,
      id: String(announcement.id),
    });
  }

  notifyAnnouncementUpdated(announcement: Announcement) {
    this.server.emit('announcement:updated', {
      ...announcement,
      id: String(announcement.id),
    });
  }
}
