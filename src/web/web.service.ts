import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/biznes/account/account.schema';
import { UserService } from 'src/biznes/user/user.service';

@Injectable()
export class WebService {
  constructor(
    private readonly config: ConfigService,
    private jwt: JwtService,
    private userService: UserService,
    // @InjectModel('App') private appMongo: Model<AppDocument>,
  ) {
    console.log('WebService initialized');
  }

  async getAllDataByMounth(telegram_id: number, mounth: number): Promise<Account[] | []> {
    return await this.userService.getAllDataByMounth(telegram_id, mounth);
  }
}
