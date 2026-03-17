import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { QueueEntity } from './queue.dto'
import { QueueService } from './queue.service'
import { QueueProcessor } from './queue.process'

@Module({
    imports: [
        BullModule.registerQueueAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            name: "audio",
            useFactory: (ConfigService: ConfigService) => ({
                name: ConfigService.get<string>("app.queue_name")
            })
        }),
        TypeOrmModule.forFeature([QueueEntity])
    ],
    providers: [QueueService,QueueProcessor],
    exports: [QueueService],
})
export class QueueModule { }

