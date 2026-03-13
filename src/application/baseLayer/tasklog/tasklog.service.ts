import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskLogEntity, CreateTaskLogDto, UpdateTaskLogDto, TaskLogStatus } from './tasklog.dto';
import { ConfigService } from '@nestjs/config';

function stringifyDetailInfo(val: any): string {
    try { return JSON.stringify(val ?? []); } catch { return '[]'; }
}
function parseDetailInfo(val: any): any[] {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.length) {
        try { return JSON.parse(val); } catch { return []; }
    }
    return [];
}

function formatWithTimezone(date: Date, tz: string): string {
    const m = /^([+-])(\d{2}):(\d{2})$/.exec(tz ?? '+00:00');
    const sign = m ? (m[1] === '-' ? -1 : 1) : 1;
    const hours = m ? parseInt(m[2], 10) : 0;
    const minutes = m ? parseInt(m[3], 10) : 0;
    const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
    const shifted = new Date(date.getTime() + offsetMs);
    return shifted.toISOString().replace('Z', tz);
}

@Injectable()
export class TasklogService {
    constructor(
        @InjectRepository(TaskLogEntity)
        private readonly repo: Repository<TaskLogEntity>,
        private readonly config: ConfigService,
    ) { }

    async create(dto: CreateTaskLogDto) {
        const tz = this.config.get<string>('app.db.timezone', '+08:00');
        const now = new Date();
        const entity = this.repo.create({
            task_id: dto.task_id,
            status: dto.status ?? TaskLogStatus.pedding,
            detail_info: stringifyDetailInfo(dto.detail_info) as any,
            create_time: formatWithTimezone(now, tz),
            update_time: formatWithTimezone(now, tz),
        });
        const saved = await this.repo.save(entity);
        return { ...saved, detail_info: parseDetailInfo(saved.detail_info) };
    }

    async findAll() {
        const rows = await this.repo.find({ order: { id: 'DESC' } });
        return rows.map((r) => ({ ...r, detail_info: parseDetailInfo(r.detail_info) }));
    }

    async findOne(id: number) {
        const found = await this.repo.findOne({ where: { id } });
        if (!found) throw new NotFoundException('TaskLog not found');
        return { ...found, detail_info: parseDetailInfo(found.detail_info) };
    }

    async update(id: number, dto: UpdateTaskLogDto) {
        const tz = this.config.get<string>('app.db.timezone', '+08:00');
        const found = await this.repo.findOne({ where: { id } });
        if (!found) throw new NotFoundException('TaskLog not found');
        const merged = this.repo.merge(found, {
            task_id: dto.task_id ?? found.task_id,
            status: dto.status ?? found.status,
            detail_info: dto.detail_info ? stringifyDetailInfo(dto.detail_info) as any : found.detail_info,
            update_time: formatWithTimezone(new Date(), tz),
        });
        const saved = await this.repo.save(merged);
        return { ...saved, detail_info: parseDetailInfo(saved.detail_info) };
    }

    async remove(id: number) {
        const res = await this.repo.delete({ id });
        return { affected: res.affected ?? 0 };
    }
}
