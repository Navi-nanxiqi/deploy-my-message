import { Injectable } from '@nestjs/common';
import { TaskService } from '../baseLayer/task/task.service';
import { TasklogService } from '../baseLayer/tasklog/tasklog.service';
import { MessageService } from '../baseLayer/message/message.service';
import { QueueService } from '../baseLayer/queue/queue.service';
import { EnvelopMessageRes, EnvelopMessageBatchRes } from './envelop.interface';


@Injectable()
export class EnvelopService {
    constructor(
        private readonly taskService: TaskService,
        private readonly taskLogService: TasklogService,
        private readonly messageService: MessageService,
        private readonly queueService: QueueService,
    ) { }

    async handelTest() {
        var task_name = "bull";
        var task_data = {
            foo: "bar"
        };
        await this.queueService.addTask(task_name, task_data);
    }

    async handelConsumeTask(type, body): Promise<EnvelopMessageRes> {
        /*
            1. task数据存储
            2. task添加到队列中
            3. 消费队列中的数据
            4. 更新task的任务状态 && 消费完成tasklog日志记录
        */
        const data = await this.messageService.send(type, body);
        return { code: data.status, type: data.type, msg: data.message }
    }

    async handelConsumeTaskBatch(body): Promise<EnvelopMessageBatchRes> {
        const data = await this.messageService.sendBatch(body);
        return { status: data.status, total: data.total, detailInfo: data.result }
    }
}
