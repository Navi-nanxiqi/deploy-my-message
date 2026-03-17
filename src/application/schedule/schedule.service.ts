import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { QueueService } from '../baseLayer/queue/queue.service';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly queueService: QueueService,
    ) { }

    // 定时消息发送
    async handelTaskCron() {
        // console.log(new Date(),"开始创建")
        // var id=randomBytes(8).toString("hex");
        // await this.queueService.addTask("audio",id)
        // console.log("结束创建")

        await this.queueService.countQueue().then((data)=>{
            console.log(data)
        })
        var data=await this.queueService.getJobs();
        console.log(data)
    }
}
