import type { Job } from "bull";
import {
  OnQueueActive,
  Process,
  Processor,
} from "@nestjs/bull";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
@Processor("audio") // 定义消费者 使用该装饰器声明消费者的所有方法
export class QueueProcessor {
  private logger: Logger = new Logger(QueueProcessor.name);

  constructor(
    private readonly configService: ConfigService,
  ) {}

//   监听队列
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Task started executing - Job ID: ${job.id}, Task name: ${job.name}`);
  }

// 监听名为audio的队列 只要队列有数据就对数据进行处理
// Process 该装饰器表示名称为audio类型的任务 对于同一个消费者可能会包含很多种类型的处理任务
@Process({
    name: "audio",
    concurrency: 50,
  })
  async processDynamicTask(job: Job) {
    console.log("开始消费")
    let process=0
    for(let i=0;i<10;++i){
        process+=1;
        console.log(job.name,job.id)
    }
    await job.progress(process);
    console.log("结束消费")
  }
}
