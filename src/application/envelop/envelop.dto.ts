import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';

export type SendType = 'Email' | 'QyWeiXin' | 'Dtalk' | 'WeChatOFAccount' | 'MessageNest' | 'Custom';

// 新增统一的渠道枚举（服务/管道使用），其中部分值与原始 api.rest 对应
export enum SendChannel {
    Email = 'Email',
    Wecom = 'QyWeiXin',
    Dingtalk = 'Dtalk',
    WeChat = 'WeChatOFAccount',
    MessageNest = 'MessageNest',  // 自托管消息渠道 渠道名
    Custom = 'Custom', //自定义推送 webhook地址和请求体
}

// 单渠道消息
export class SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsString() @IsNotEmpty()
    content: string;

    @IsString() @IsNotEmpty()
    @IsIn(['Email', 'QyWeiXin', 'Dtalk', 'WeChatOFAccount', 'MessageNest', 'Custom'])
    type: SendChannel;

    // 添加装饰器（标记为可选以避免全局 ValidationPipe 的 whitelist 移除）
    @IsOptional()
    auth?: Record<string, any>;


    // 添加装饰器，管道会根据不同渠道进行具体字段校验
    @IsOptional()
    config?: Record<string, any>;
}

// 多渠道消息
export interface SendWayAuth { [key: string]: any; }
export interface SendWayConfig { [key: string]: any; }
class sendWayDto {
    @IsString() @IsNotEmpty() name: string;
    @IsString() @IsNotEmpty() type: SendType;
    @IsOptional() auth: SendWayAuth; // auth可为空：当为自托管消息的时候为空
    @IsOptional() config: SendWayConfig;
}
export class SendMessageBatchReqDto {
    @IsString() @IsNotEmpty() title: string;
    @IsString() @IsNotEmpty() content: string;
    @IsArray() @ValidateNested({ each: true }) @Type(() => sendWayDto)
    sendway: sendWayDto[];
}



// Email 渠道
export class EmailAuthDto {
    @IsString() @IsNotEmpty()
    server: string;

    @IsString() @IsNotEmpty()
    port: string;

    @IsString() @IsNotEmpty()
    account: string;

    @IsString() @IsNotEmpty()
    password: string;

    @IsBoolean()
    tls?: boolean;
}
export class EmailConfigDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })  // each 表示遍历校验数组中每一个数据都是字符串类型
    to_account: string[];
}
export class EmailMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsString() @IsNotEmpty()
    content: string;

    @IsIn(['Email'])
    type: SendChannel;

    @ValidateNested()
    @Type(() => EmailAuthDto)
    auth: EmailAuthDto;

    @ValidateNested()
    @Type(() => EmailConfigDto)
    config: EmailConfigDto;
}

// 企业微信渠道
export class WeiXinAuthDto {
    @IsString() @IsNotEmpty()
    token: string;
}
export class WeiXinMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsString() @IsNotEmpty()
    content: string;

    @IsIn(['QyWeiXin'])
    type: SendChannel;

    @ValidateNested()
    @Type(() => WeiXinAuthDto)
    auth: WeiXinAuthDto;

    config: Record<string, any>;
}

// 钉钉渠道
export class DingtalkAuthDto {
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @IsString()
    @IsNotEmpty()
    cry_sign: string;
}
export class DingtalkMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsIn(['Dtalk'])
    type: SendChannel;

    @IsString() @IsNotEmpty()
    content: string;

    config: Record<string, any>;

    @ValidateNested() @Type(() => DingtalkAuthDto)
    auth: DingtalkAuthDto;
}



// 微信公众号模板
export class WebhookAuthDto {
    @IsString() @IsNotEmpty()
    app_id: string;

    @IsString() @IsNotEmpty()
    app_secret: string;

    @IsString() @IsNotEmpty()
    template_message_id: string;
}
export class WebhookConfigDto {
    @IsArray()
    @IsString({ each: true })  // each 表示遍历校验数组中每一个数据都是字符串类型
    openid: string[];
}
export class WebhookMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsString() @IsNotEmpty()
    content: string;

    @IsIn(['WeChatOFAccount'])
    type: SendChannel;

    @ValidateNested()
    @Type(() => WebhookAuthDto)
    auth: WebhookAuthDto;

    @ValidateNested()
    @Type(() => WebhookConfigDto)
    config: WebhookConfigDto;
}


// 自托管消息
export class MessageNestMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsIn(['MessageNest']) type: SendChannel;
    @IsString() @IsNotEmpty() content: string;
    auth: Record<string, any>;
    config: Record<string, any>;
}

// 自定义推送
export class CustomAuthDto {
    @IsString() @IsNotEmpty()
    webhook: string;

    body: Record<string, any>;
}
export class CustomMessageDto implements SendMessageReqDto {
    @IsString() @IsNotEmpty()
    title: string;

    @IsIn(['Custom']) type: SendChannel;
    @IsString() @IsNotEmpty() content: string;
    auth: Record<string, any>;
    config: Record<string, any>;
}