import { Module } from '@nestjs/common';
import { WebService } from './web.service';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { UserModule } from 'src/biznes/user/user.module';
import { AccountModule } from 'src/biznes/account/account.module';
import { CheckModule } from 'src/biznes/check/check.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { WebGateway } from './web.gateway';

@Module({
  imports: [GlobalConfigModule, UserModule, AccountModule, CheckModule, OpenaiModule],
  providers: [WebService, WebGateway],
  exports: [WebService],
})
export class WebModule {}
