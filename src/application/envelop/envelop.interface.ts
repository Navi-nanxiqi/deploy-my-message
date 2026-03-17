import { SendChannel } from "./envelop.dto";
import { SendMessageStatus } from "../baseLayer/message/message.interface";

export interface EnvelopMessageRes {
    code: number,
    type: SendChannel,
    msg: any,
}

export interface EnvelopMessageBatchRes {
    status: SendMessageStatus,
    total: number,
    detailInfo: any[],
}