import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
    SendMessageReqDto,
    SendChannel,
    EmailMessageDto,
    WeiXinMessageDto,
    DingtalkMessageDto,
    WebhookMessageDto,
    MessageNestMessageDto,
    CustomMessageDto
} from '../envelop.dto';

@Injectable()
export class ChannelValidationPipe implements PipeTransform {
    transform(value: SendMessageReqDto, _metadata: ArgumentMetadata) {
        if (!value || !value.type) {
            throw new BadRequestException('type is required');
        }
        // 顶层字段兼容：支持 Auth/Config 大小写别名
        const v: any = value ?? {};
        const normalized: SendMessageReqDto = {
            title: v.title,
            content: v.content,
            type: v.type,
            auth: v.auth ?? v.Auth,
            config: v.config ?? v.Config,
        } as SendMessageReqDto;

        const type = normalized.type as SendChannel;
        let TargetDto: any;
        switch (type) {
            case SendChannel.Email:
                TargetDto = EmailMessageDto; break;
            case SendChannel.Wecom:
                TargetDto = WeiXinMessageDto; break;
            case SendChannel.Dingtalk:
                TargetDto = DingtalkMessageDto; break;
            case SendChannel.WeChat:
                TargetDto = WebhookMessageDto; break;
            case SendChannel.MessageNest:
                TargetDto = MessageNestMessageDto; break;
            case SendChannel.Custom:
                TargetDto = CustomMessageDto; break;
            default:
                throw new BadRequestException('Unsupported send channel');
        }
        const instance = plainToInstance(TargetDto, normalized, { enableImplicitConversion: true });
        const errors = validateSync(instance as object, { whitelist: true, forbidNonWhitelisted: false });
        if (errors.length) {
            throw new BadRequestException(errors.map(e => Object.values(e.constraints ?? {})).flat().join('; '));
        }
        return instance;
    }
}