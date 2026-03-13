export type QueueStatus = "pending" | "done";
export interface QueueEntity {
    id: number;
    // 队列名称
    name: string;
    // 该队列该条task数据的状态
    status: QueueStatus;
    data: any[]; // 数据类型为 TaskEntity 上层传递
    create_time: string;
    update_time: string;
}

export interface CreateQueue {
    name: string;
}

