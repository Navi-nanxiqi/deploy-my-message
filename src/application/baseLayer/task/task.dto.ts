// DTOs
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';


// 任务表
@Entity({ name: 'task' })
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    // store sendway array as JSON string
    @Column({ type: 'text' })
    sendway: any;

    // 使用字符串时间 + 数据库时区，例如 2025-12-03T16:54:00.393+08:00
    @Column({ name: 'create_time', type: 'varchar', length: 32 })
    create_time: string;

    @Column({ name: 'update_time', type: 'varchar', length: 32 })
    update_time: string;
}


export class CreateSendWayDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    auth: Record<string, any>;
    config: Record<string, any>;
}

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSendWayDto)
    sendway: CreateSendWayDto[];
}

export class CreateTaskBodyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSendWayDto)
    sendway: CreateSendWayDto[];
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) { }
