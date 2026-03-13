// Log module interfaces based on readme schema

export type Timestamp = Date;

export type TaskLogStatus = 'success' | 'pedding' | 'fail';

export interface DetailInfoItem {
    name: string,
    type: string,
    ok: boolean,
    result: string,
}

export type DetailInfo = DetailInfoItem[];

export interface TaskLogEntity {
    id: number;
    task_id: number;
    status: TaskLogStatus;
    detail_info: DetailInfo;
    create_time: Timestamp;
    update_time: Timestamp;
}