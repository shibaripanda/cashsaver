import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Check, CheckDocument } from './check.schema';
import { Model } from 'mongoose';
import { NewCheck } from 'src/openai/interfaces/Expense';

@Injectable()
export class CheckService {
  constructor(
    @InjectModel(Check.name) private checkModel: Model<CheckDocument>,
  ) {}

  async deleteCheck(_id: string, owner: string) {
    return await this.checkModel.deleteOne({ _id, owner });
  }

  async createNewCheck(
    newCheck: NewCheck,
    ownerId: string,
  ): Promise<CheckDocument> {
    return await this.checkModel.create({
      info: newCheck.info,
      cost: newCheck.cost,
      owner: ownerId,
    });
  }
}
