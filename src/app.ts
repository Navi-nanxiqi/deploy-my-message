import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import settings from './config/settings';
import { ScheduleModule } from './application/schedule/schedule.module';
import { EnvelopModule } from './application/envelop/envelop.module';
import { AuthModule } from './application/auth/auth.module';
import { AuthGuard } from './utils/auth/auth.guard';
import { PermissionGuard } from './utils/auth/permission.guard';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [settings],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: (configService.get<string>('app.db.type', 'sqlite') as any),
                database: configService.get<string>('app.db.database', 'data.sqlite'),
                synchronize: configService.get<boolean>('app.db.synchronize', true),
                autoLoadEntities: true,
            }),
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get<string>('app.redis')
            })
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "src/web/dist"),
            serveRoot:"/web/",
            exclude: ['/api/{*test}'], 
            serveStaticOptions: {
              fallthrough: true,
            }
        }),
        ScheduleModule,
        EnvelopModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        //全局认证守卫
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        // 全局权限守卫
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        }
    ],
})
export class App { }
