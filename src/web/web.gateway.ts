import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
import { AccountService } from 'src/biznes/account/account.service';
import { WebService } from './web.service';
import { MySocket } from 'src/app/app.gateway';
// import { Types } from 'mongoose';

// export interface MySocket extends Socket {
//   data: {
//     user: { userId: string; iat: number; exp: number };
//   };
// }

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WebGateway {
  constructor(
    private jwt: JwtService,
    private webService: WebService,
    private accountService: AccountService,
  ) {}

  // @WebSocketServer()
  // server: Server;
  @SubscribeMessage('get-all-data-by-mounth')
  async getAllDataByMounth(@ConnectedSocket() client: MySocket, @MessageBody() messageBody: { mounth: number }) {
    console.log(client.data.user, messageBody);
    return await this.webService.getAllDataByMounth(Number(client.data.user.userId), messageBody.mounth);
  }
}
