import { Controller,Get } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Cron } from '@nestjs/schedule';

@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
    ) { }

    // @Cron('* * * * * *')
    handleTaskCron() {
        this.scheduleService.handelTaskCron();
    }
}
