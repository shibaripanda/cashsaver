import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getBlockUsers(): number[] {
    return [244242424, 2424242424];
  }
}
