// Task module interfaces based on readme schema

export type Timestamp = Date;

// Send way config/auth are free-form objects from client
export interface SendWayAuth {
    [key: string]: any;
}
export interface SendWayConfig {
    [key: string]: any;
}

// Known channel types (extend as needed). Fallback to string for future types.

export enum SendWayType {
    "Email" = "Email",
    "QyWeiXin" = "QyWeiXin",
    "Dtalk" = "Dtalk",
    "WeChatOFAccount" = "WeChatOFAccount",
    "MessageNest" = "MessageNest",
    "Custom" = "Custom",
}


export interface SendWay {
    name: string;
    type: SendWayType;
    auth: SendWayAuth;
    config: SendWayConfig;
}

export interface SingleTaskEntity {
    title: string;
    content: string;
    name: string;
    type: SendWayType;
    auth: SendWayAuth;
    config: SendWayConfig;
}

export interface TaskEntity {
    id: number;
    title: string;
    content: string;
    sendway: SendWay[];
    create_time: Timestamp;
    update_time: Timestamp;
}