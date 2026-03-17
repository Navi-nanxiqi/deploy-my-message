import { Controller, Post, Body, UsePipes, Get, Session, Req, Res } from '@nestjs/common';
import { ChannelValidationPipe } from './pipes/channel-validation.pipe';
import { EnvelopService } from './envelop.service';
import { SendMessageReqDto, SendMessageBatchReqDto } from './envelop.dto';
import { SendChannel } from './envelop.dto';
import { ApiPublic } from 'src/utils/auth/auth.decorator';
import { RequirePermission } from 'src/utils/auth/auth.decorator';

@Controller('envelop')
export class EnvelopController {
  constructor(private readonly envelopService: EnvelopService) { }

  @Post('send')
  @UsePipes(ChannelValidationPipe)
  async handelConsumeTask(@Body() body: SendMessageReqDto) {
    return this.envelopService.handelConsumeTask(body.type as SendChannel, body);
  }

  // 批量渠道发送，支持数组入参
  @Post('batch')
  async handelConsumeTaskBatch(@Body() body: SendMessageBatchReqDto) {
    return this.envelopService.handelConsumeTaskBatch(body);
  }

  @Post('test')
  async handelTest() {
    this.envelopService.handelTest();
  }

  @Get('session')
  @RequirePermission("admin")
  getSession() {
    console.log("test /envelop/session public and permission api")
  }
}
