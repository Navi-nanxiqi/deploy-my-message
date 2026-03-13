import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QueueEntity } from './queue.dto'
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue("audio")
        private audio_queue: Queue,
        @InjectRepository(QueueEntity)
        private readonly repo: Repository<QueueEntity>,
    ) { }

    async addTask(taskName: string = "audio", taskData) {
        const job = await this.audio_queue.add(taskName, taskData);
        console.log(`${taskData} add into queue, Job ID: ${job.id}`)
        return job;
    }


    async clearQueue() {
        await this.audio_queue.empty();
        console.log("queue cleared");
    }

    async countQueue() {
        const counts = await this.audio_queue.getJobCounts();
        console.log("Job counts:", counts);
        return counts;
    }

    async getJobs(types: string[] = ['completed', 'waiting', 'active', 'failed', 'delayed']) {
        const jobs = await this.audio_queue.getJobs(types as any);
        return jobs.map(job => ({
            id: job.id,
            name: job.name,
            data: job.data,
            status: job.finishedOn ? 'completed' : (job.failedReason ? 'failed' : 'pending'), // 简化的状态判断，实际可更详细
            returnValue: job.returnvalue,
            failedReason: job.failedReason,
            timestamp: new Date(job.timestamp).toISOString(),
            finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : null
        }));
    }


    //////////////////////////////// 私有方法
    private stringify(val: any): string {
        try { return JSON.stringify(val ?? []); } catch { return '[]'; }
    }

    private parse(val: any): any[] {
        if (Array.isArray(val)) return val
        if (typeof val === 'string' && val.length) {
            try { return JSON.parse(val) } catch { return [] }
        }
        return []
    }

    private formatWithTimezone(date: Date, tz: string): string {
        const m = /^([+-])(\d{2}):(\d{2})$/.exec(tz ?? '+08:00')
        const sign = m ? (m[1] === '-' ? -1 : 1) : 1
        const hours = m ? parseInt(m[2], 10) : 0
        const minutes = m ? parseInt(m[3], 10) : 0
        const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000
        const shifted = new Date(date.getTime() + offsetMs)
        return shifted.toISOString().replace('Z', tz)
    }
}

