import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
  // MessageBody,
  // ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppService } from './app.service';
import { AccountService } from 'src/biznes/account/account.service';
// import { Types } from 'mongoose';

export interface MySocket extends Socket {
  data: {
    user: { userId: string; iat: number; exp: number };
  };
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwt: JwtService,
    private appService: AppService,
    private accountService: AccountService,
  ) {}

  @WebSocketServer()
  // server: Server;
  // @SubscribeMessage('get_account_mounth')
  // async handleGetMyAccountData(
  //   @ConnectedSocket() client: MySocket,
  //   @MessageBody() data: { mounth: number; account_id: Types.ObjectId },
  // ) {
  //   return await this.accountService.getAccountWithChecksMounth(data.account_id, data.mounth);
  // }

  // @SubscribeMessage('get_my_data_mounth')
  // async handleGetMyDataThisMonth(@ConnectedSocket() client: MySocket, @MessageBody() data: { mounth: number }) {
  //   return await this.appService.getMyAccountListWithChecksSumsAndCountsCurrentMounth(
  //     client.data.user.userId,
  //     data.mounth,
  //   );
  // }
  handleConnection(client: MySocket) {
    const token: string = client.handshake.auth?.token as string;
    if (!token) {
      client.disconnect();
      return;
    }
    const user: { userId: string; iat: number; exp: number } = this.jwt.verify(token);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data.user = user;
    console.log('connected:', client.id, user.userId);
  }

  handleDisconnect(client: MySocket) {
    console.log('disconnected:', client.id, client.data.user.userId);
  }
}
