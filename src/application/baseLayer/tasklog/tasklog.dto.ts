// DTOs
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SendChannel } from '../message/message.dto';

export type DetailInfo = Array<{
    name: string,
    type: SendChannel,
    ok: boolean,
    result: string,
}>

// 任务日志表
@Entity({ name: 'task_log' })
export class TaskLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'task_id' })
    task_id: number;

    @Column({ type: 'varchar', length: 20 })
    status: string;

    // store detail_info array as JSON
    @Column({ type: 'text' })
    detail_info: DetailInfo; // JSON string of DetailInfo

    // 使用字符串时间 + 数据库时区，例如 2025-12-03T16:54:00.393+08:00
    @Column({ name: 'create_time', type: 'varchar', length: 32 })
    create_time: string;

    @Column({ name: 'update_time', type: 'varchar', length: 32 })
    update_time: string;
}


export enum TaskLogStatus {
    success = "success",
    fail = "fail",
    pedding = "pedding"
}

export class DetailInfoItemDto {
    @IsString()
    name: string;

    @IsString()
    @IsIn(['Email', 'QyWeiXin', 'Dtalk', 'WeChatOFAccount', 'MessageNest', 'Custom'])
    type: SendChannel;

    @IsBoolean()
    ok: boolean;

    @IsString()
    result: string;
}

export class CreateTaskLogDto {
    @IsInt()
    task_id: number;

    @IsString()
    @IsIn(['success', 'pedding', 'fail'])
    status: TaskLogStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetailInfoItemDto)
    detail_info: DetailInfoItemDto[];
}


export class taskLogData {
    isAchieve: boolean;
    message: string;
}
export type taskLogRes = taskLogData;

export class UpdateTaskLogDto extends PartialType(CreateTaskLogDto) { }
