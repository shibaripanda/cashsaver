import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Check, CheckDocument } from './check.schema';
import { Model } from 'mongoose';

@Injectable()
export class CheckService {
  constructor(
    @InjectModel(Check.name) private accountModel: Model<CheckDocument>,
  ) {}

  async createNewCheck(newCheck: Check) {
    const res = await this.accountModel.insertOne({
      info: newCheck.info,
      cost: newCheck.cost,
    });
    return res;
  }
}
