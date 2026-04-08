import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckSchema } from './check.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Check', schema: CheckSchema }]),
  ],
  providers: [CheckService],
  exports: [CheckService],
})
export class CheckModule {}
