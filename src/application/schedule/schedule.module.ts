import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { QueueModule } from '../baseLayer/queue/queue.module';

@Module({
    imports: [
        NestScheduleModule.forRoot(),
        QueueModule
    ],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleModule],
})
export class ScheduleModule { }
