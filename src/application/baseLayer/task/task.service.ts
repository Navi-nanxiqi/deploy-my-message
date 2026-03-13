import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity, CreateTaskDto, UpdateTaskDto } from './task.dto';
import { ConfigService } from '@nestjs/config';

function stringifySendway(val: any): string {
    try { return JSON.stringify(val ?? []); } catch { return '[]'; }
}
function parseSendway(val: any): any[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.length) {
        try { return JSON.parse(val); } catch { return []; }
    }
    return [];
}

function formatWithTimezone(date: Date, tz: string): string {
    // tz like '+08:00' or '-05:00'
    const m = /^([+-])(\d{2}):(\d{2})$/.exec(tz ?? '+00:00');
    const sign = m ? (m[1] === '-' ? -1 : 1) : 1;
    const hours = m ? parseInt(m[2], 10) : 0;
    const minutes = m ? parseInt(m[3], 10) : 0;
    const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
    const shifted = new Date(date.getTime() + offsetMs);
    // ISO string without timezone conversion; then append tz
    return shifted.toISOString().replace('Z', tz);
}

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repo: Repository<TaskEntity>,
        private readonly config: ConfigService,
    ) { }

    async create(dto: CreateTaskDto) {
        const tz = this.config.get<string>('app.db.timezone', '+08:00');
        const now = new Date();
        const entity = this.repo.create({
            title: dto.title,
            content: dto.content,
            sendway: stringifySendway(dto.sendway) as any,
            create_time: formatWithTimezone(now, tz),
            update_time: formatWithTimezone(now, tz),
        });
        const saved = await this.repo.save(entity);
        // TaskEntity {
        //     id: 2,
        //     title: '系统播报',
        //     content: '系统警报正文',
        //     sendway: '[{"name":"邮件渠道A","type":"Email"},{"name":"公众号渠道A","type":"WeChatOFAccount"},{"name":"企业微信渠道A","type":"QyWeiXin"}]',
        //     create_time: 2025-12-03T08:54:00.393Z,
        //     update_time: 2025-12-03T08:54:00.393Z
        //   }
        return { ...saved, sendway: parseSendway(saved.sendway) };
    }

    async findAll() {
        const rows = await this.repo.find({ order: { id: 'DESC' } });
        return rows.map((r) => ({ ...r, sendway: parseSendway(r.sendway) }));
    }

    async findOne(id: number) {
        const found = await this.repo.findOne({ where: { id } });
        if (!found) throw new NotFoundException('Task not found');
        return { ...found, sendway: parseSendway(found.sendway) };
    }

    async update(id: number, dto: UpdateTaskDto) {
        const tz = this.config.get<string>('app.db.timezone', '+08:00');
        const found = await this.repo.findOne({ where: { id } });
        if (!found) throw new NotFoundException('Task not found');
        const merged = this.repo.merge(found, {
            title: dto.title ?? found.title,
            content: dto.content ?? found.content,
            sendway: dto.sendway !== undefined ? stringifySendway(dto.sendway) as any : found.sendway,
            update_time: formatWithTimezone(new Date(), tz),
        });
        const saved = await this.repo.save(merged);
        return { ...saved, sendway: parseSendway(saved.sendway) };
    }

    async remove(id: number) {
        const res = await this.repo.delete({ id });
        return { affected: res.affected ?? 0 };
    }
}
