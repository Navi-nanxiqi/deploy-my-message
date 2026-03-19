import { NestFactory } from '@nestjs/core';
import { App } from './app';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resolveLogLevels } from './utils/log.level';
import { join } from "path";
import { ResponseTransInterceptor } from './utils/interceptors/response-trans.intercept';
import { HttpStatusInterceptor } from './utils/interceptors/http-status.intercept';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(App, {
        bufferLogs: true,
        cors: true,
    });
    app.setGlobalPrefix('api');

    const config = app.get(ConfigService);
    const port = config.get<number>('app.port', 3000);
    const logLevel = config.get<string>('app.logLevel', 'log');
    const secret = config.get<string>('app.secret');

    // Enable global validation for DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO中未定义的字段就会被自动过滤移除掉
            transform: true,
            forbidUnknownValues: false,
        }),
    );

    // 全局拦截器
    app.useGlobalInterceptors(
        new HttpStatusInterceptor(),
        new ResponseTransInterceptor(),
    );

    app.useLogger(resolveLogLevels(logLevel));

    await app.listen(port);
    logger.log(`Server started on http://localhost:${port}/web`);
}
bootstrap().catch((err) => {
    console.error('启动失败:', err);
    process.exit(1);
});
