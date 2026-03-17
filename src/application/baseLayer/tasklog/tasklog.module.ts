import { Module } from '@nestjs/common';
import { TasklogService } from './tasklog.service';
import { TaskLogEntity } from './tasklog.dto';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([TaskLogEntity])],
  providers: [TasklogService],
  exports: [TasklogService],
})
export class TasklogModule { }
