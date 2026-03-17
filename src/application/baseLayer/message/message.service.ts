import { BadRequestException, Injectable } from '@nestjs/common';
import {
    AnyChannelMessageDto,
    SendChannel,
    EmailMessageDto,
    EmailAuthDto,
    WeiXinMessageDto,
    WeiXinAuthDto,
    DingtalkMessageDto,
    DingtalkAuthDto,
    WebhookMessageDto,
    WebhookAuthDto,
    MessageNestMessageDto,
    CustomMessageDto,
    CustomAuthDto,
    sendMessageReqDto
} from './message.dto';
import { SendMessageStatus, SendBatch } from './message.interface';
import { SendMessageRes, SendMessageBatchRes } from './message.interface';
import { postJson } from 'src/utils/api.service';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

@Injectable()
export class MessageService {
    constructor(
    ) { }


    // 单渠道发送
    async send(type: SendChannel, dto: AnyChannelMessageDto): Promise<SendMessageRes> {
        // 基于 type 进行渠道级校验与分发
        // 统一规范化 auth/config，兼容大小写/别名
        const normalizedAuth = this.normalizeAuth(type, dto.auth);
        const normalizedConfig = this.normalizeConfig(type, dto.config);
        const normalizedDto = { ...dto, auth: normalizedAuth, config: normalizedConfig } as AnyChannelMessageDto;
        switch (type) {
            case SendChannel.Email:
                return this.handleEmail(normalizedDto as EmailMessageDto);
            case SendChannel.Wecom:
                return this.handleWecom(normalizedDto as WeiXinMessageDto);
            case SendChannel.Dingtalk:
                return this.handleDingtalk(normalizedDto as DingtalkMessageDto);
            case SendChannel.WeChat:
                return this.handleWeChatOfficial(normalizedDto as WebhookMessageDto);
            case SendChannel.MessageNest:
                return this.handleMessageNest(normalizedDto as MessageNestMessageDto);
            case SendChannel.Custom:
                return this.handleCustom(normalizedDto as CustomMessageDto);
            default:
                throw new BadRequestException('Unsupported send channel');
        }
    }

    // 批量渠道发送
    async sendBatch(body: sendMessageReqDto): Promise<SendMessageBatchRes> {
        if (!body || !body.sendway?.length) {
            throw new BadRequestException('sendway array is required');
        }
        console.log("信息发送开始：----------");
        const results: SendBatch[] = [];
        var cover_result = true;
        for (const way of body.sendway) {
            const type = way.type as SendChannel;
            const dto: AnyChannelMessageDto = {
                title: body.title,
                content: body.content,
                type,
                auth: this.normalizeAuth(type, way.auth),
                config: this.normalizeConfig(type, way.config),
            } as AnyChannelMessageDto;
            try {
                console.log(type, "res:", dto);
                const res = await this.send(type, dto);
                console.log(type, "res:", res);
                if (res.status != 200) {
                    results.push({ name: way.name, type: type, ok: false, result: res.message });
                    // cover_result 控全部是数据是否传输成功 存在一条失败即为失败
                    cover_result = false;
                } else {
                    results.push({ name: way.name, type: type, ok: true, result: res.message });
                }
            } catch (err: any) {
                results.push({ name: way.name, type: type, ok: false, result: err?.message ?? String(err) });
            }
        }
        return cover_result ? { total: body.sendway.length, status: SendMessageStatus.SUCCESS, result: results } :
            { total: body.sendway.length, status: SendMessageStatus.FAIL, result: results }
    }

    // 邮箱消息发送 （ handleEmail ）
    private async handleEmail(dto: EmailMessageDto): Promise<SendMessageRes> {
        // 校验：必须存在 to_account 
        if (!dto?.config?.to_account || !dto?.config?.to_account?.length) throw new BadRequestException('Email to list is required');
        if (!dto?.auth?.server || !dto?.auth?.port || !dto?.auth?.account || !dto?.auth?.password) {
            throw new BadRequestException('Email auth server/port/account/password are required');
        }

        const portNum = parseInt(String(dto.auth.port), 10);
        const transporter = nodemailer.createTransport({
            host: dto.auth.server,
            port: isNaN(portNum) ? 465 : portNum,
            secure: dto.auth.tls ?? (portNum === 465),
            auth: {
                user: dto.auth.account,
                pass: dto.auth.password,
            },
        });

        try {
            const info = await transporter.sendMail({
                from: dto.auth.account,
                to: dto.config.to_account.join(','),
                subject: dto.title,
                text: dto.content,
            });
            return { type: dto.type, status: 200, message: `send message successful: ${info?.messageId ?? ''}` };
        } catch (err: any) {
            return { type: dto.type, status: 500, message: `send message failed: ${err?.message ?? String(err)}` };
        }
    }

    // 钉钉消息 （handleDingtalk）
    private async handleDingtalk(dto: DingtalkMessageDto): Promise<SendMessageRes> {
        if (!dto.config?.webhook) throw new BadRequestException('DingTalk webhook is required');
        let url = dto.config.webhook;
        // 可选的加签（access_token 作为 secret）
        if (dto.auth?.access_token) {
            const timestamp = Date.now();
            const sign = crypto.createHmac(dto.auth.cry_sign, dto.auth.access_token)
                .update(`${timestamp}\n${dto.auth.access_token}`)
                .digest('base64');
            const qs = `timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
            url = url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`;
        }
        const payload = { msgtype: 'text', text: { content: `${dto.title}\n${dto.content}` } };
        const { status, text } = await postJson(url, payload);
        const ok = status >= 200 && status < 300;
        return { type: dto.type, status, message: ok ? 'send message successful' : `send message failed: ${text}` };
    }


    // 企业微信（QyWeiXin）
    private async handleWecom(dto: WeiXinMessageDto): Promise<SendMessageRes> {
        if (!dto.auth?.token) throw new BadRequestException('WeCom token is required');
        const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${dto.auth.token}`;
        const payload = { msgtype: 'text', text: { content: dto.content } };
        const { status, text } = await postJson(url, payload);
        const ok = status >= 200 && status < 300;
        return { type: dto.type, status, message: ok ? 'send message successful' : `send message failed: ${text}` };
    }

    // 微信公众号模板消息（WeChatOFAccount）
    private async handleWeChatOfficial(dto: WebhookMessageDto): Promise<SendMessageRes> {
        if (!dto.config?.openid?.length) throw new BadRequestException('openid is required');
        if (!dto.auth?.app_id || !dto.auth?.app_secret || !dto.auth?.template_message_id) {
            throw new BadRequestException('app_id/app_secret/template_message_id are required');
        }
        // 获取 access_token
        const tokenRes = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${dto.auth.app_id}&secret=${dto.auth.app_secret}`);
        const tokenJson: any = await tokenRes.json();
        const access_token = tokenJson?.access_token;
        if (!access_token) {
            throw new BadRequestException(`get access_token failed: ${JSON.stringify(tokenJson)}`);
        }
        let allOk = true;
        let lastText = '';
        for (const openid of dto.config.openid) {
            const body = {
                touser: openid,
                template_id: dto.auth.template_message_id,
                // 简单的数据结构，模板需与此匹配
                data: {
                    first: { value: dto.title },
                    remark: { value: dto.content },
                },
            };
            const { status, text } = await postJson(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`, body);
            lastText = text;
            try {
                const j = JSON.parse(text);
                if (j.errcode !== 0) allOk = false;
            } catch {
                if (!(status >= 200 && status < 300)) allOk = false;
            }
        }
        return { type: dto.type, status: allOk ? 200 : 500, message: allOk ? 'send message successful' : `send message partial/failed: ${lastText}` };
    }


    // 自托管消息
    private async handleMessageNest(dto: MessageNestMessageDto): Promise<SendMessageRes> {
        if (!dto.config?.url) throw new BadRequestException('Webhook url is required');
        const payload = { title: dto.title, content: dto.content, ...(dto.auth?.body ? { body: dto.auth.body } : {}) };
        const { status, text } = await postJson(dto.config.url, payload);
        const ok = status >= 200 && status < 300;
        return { type: dto.type, status, message: ok ? 'send message successful' : `send message failed: ${text}` };
    }

    // 自定义推送 （handeleCustom）
    private async handleCustom(dto: CustomMessageDto): Promise<SendMessageRes> {
        if (!dto.auth?.webhook) throw new BadRequestException('Custom webhook is required');
        const payload = dto.auth?.body ?? { title: dto.title, content: dto.content };
        const { status, text } = await postJson(dto.auth.webhook, payload);
        const ok = status >= 200 && status < 300;
        return { type: dto.type, status, message: ok ? 'send message successful' : `send message failed: ${text}` };
    }

    ///////////////////////////// 私有方法
    // auth 配置解析
    private normalizeAuth(type: SendChannel, auth: Record<string, any> = {}) {
        switch (type) {
            case SendChannel.Email:
                return {
                    server: auth.Server ?? auth.server,
                    port: String(auth.Port ?? auth.port ?? ''),
                    account: auth.Account ?? auth.account,
                    password: auth.Password ?? auth.password,
                    tls: auth.TLS ?? auth.tls,
                } as EmailAuthDto;
            case SendChannel.Wecom:
                return {
                    token: auth.Token ?? auth.token,
                } as WeiXinAuthDto;
            case SendChannel.Dingtalk:
                return {
                    access_token: auth.access_token ?? auth.access_token,
                    cry_sign: auth.Cry_Sign ?? auth.cry_sign,
                } as DingtalkAuthDto;
            case SendChannel.WeChat:
                return {
                    app_id: auth.App_ID ?? auth.app_id,
                    app_secret: auth.App_Secret ?? auth.app_secret,
                    template_message_id: auth.Template_Message_ID ?? auth.template_message_id,
                } as WebhookAuthDto;
            case SendChannel.MessageNest:
            case SendChannel.Custom:
                return {
                    webhook: auth.Webhook ?? auth.webhook,
                    body: auth.Body ?? auth.body,
                } as CustomAuthDto;
            default:
                return auth;
        }
    }
    // config 配置解析
    private normalizeConfig(type: SendChannel, config: Record<string, any> = {}) {
        switch (type) {
            case SendChannel.Email:
                // 转换为数组
                const to = config.to_account ?? config.ToAccount;
                return { to_account: Array.isArray(to) ? to : (to ? [to] : []) };
            case SendChannel.Wecom:
                return {};
            case SendChannel.Dingtalk:
                // 保留 webhook 字段
                return { webhook: config.webhook ?? config.WebHook ?? config.url };
            case SendChannel.WeChat:
                const openid = config.openid ?? config.OpenId ?? config.ToAccount;
                return { openid: Array.isArray(openid) ? openid : (openid ? [openid] : []) };
            case SendChannel.MessageNest:
            case SendChannel.Custom:
                return config;
            default:
                return config;
        }
    }
}