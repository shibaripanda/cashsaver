import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { UserService } from 'src/biznes/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/biznes/user/user.service';

@Injectable()
export class AppService {
  private tokens = new Map<string, TokenData>();

  constructor(
    private readonly config: ConfigService,
    private jwt: JwtService,
    private userService: UserService,
    // @InjectModel('App') private appMongo: Model<AppDocument>,
  ) {
    console.log('AppService initialized');
  }

  // async getMyAccountListWithChecksSumsAndCountsCurrentMounth(userId: string, mounth: number) {
  //   return await this.userService.getMyAccountListWithChecksSumsAndCountsCurrentMounthByTelegramId(
  //     Number(userId),
  //     mounth,
  //   );
  // }

  async validateToken(token: string): Promise<TokenAndUserId | null> {
    const data: TokenData | undefined = this.tokens.get(token);
    if (!data || data.used || data.expiresAt < Date.now()) return null;

    data.used = true;
    this.tokens.set(token, data);
    this.tokens.delete(token);
    return {
      token: await this.jwt.signAsync({ userId: data.userId }),
      userId: data.userId,
    };
  }

  getAuthLink(userId: number): string {
    const token = this.generateToken(String(userId));
    return `${this.config.get<string>('WEB_URL')}/?token=${token}`;
  }

  generateToken(userId: string): string {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiresAt <= now) {
        this.tokens.delete(token);
      }
    }

    const token: string = uuidv4();
    const expiresAt = now + 10 * 60 * 1000; // 10 минут
    this.tokens.set(token, { userId, used: false, expiresAt });
    return token;
  }

  getBlockUsers(): number[] {
    return [244242424, 2424242424];
  }
}

interface TokenAndUserId {
  token: string;
  userId: string;
}

interface TokenData {
  userId: string;
  used: boolean;
  expiresAt: number;
}
