import { SendChannel } from "./message.dto";
export interface SendBatch {
    name: string;
    type: string;
    ok: boolean,
    result: string,
}

export enum SendMessageStatus {
    "SUCCESS" = "success",
    "FAIL" = "fail"
}

// 多渠道消息发送的返回值
export interface SendMessageBatchRes {
    status: SendMessageStatus,
    total: number,
    result: SendBatch[],
}

// 单渠道消息发送的返回值
export interface SendMessageRes {
    type: SendChannel,
    status: number, // 发送消息接口的返回状态码
    message: string,
}


