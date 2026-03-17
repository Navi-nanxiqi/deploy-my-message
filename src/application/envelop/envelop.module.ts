import { Module } from '@nestjs/common';
import { EnvelopService } from './envelop.service';
import { EnvelopController } from './envelop.controller';
import { TaskModule } from '../baseLayer/task/task.module';
import { TasklogModule } from '../baseLayer/tasklog/tasklog.module';
import { MessageModule } from '../baseLayer/message/message.module';
import { QueueModule } from '../baseLayer/queue/queue.module';


@Module({
    imports: [
        TaskModule,
        TasklogModule,
        MessageModule,
        QueueModule
    ],
    controllers: [EnvelopController],
    providers: [EnvelopService],
    exports: [EnvelopModule]
})
export class EnvelopModule { }
