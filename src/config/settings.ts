// src/config/settings.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    logLevel: process.env.LOG_LEVEL ?? 'log',
    db: {
        type: (process.env.DB_TYPE ?? 'sqlite') as 'sqlite',
        database: process.env.DB_DATABASE ?? 'data.sqlite',
        synchronize: (process.env.DB_SYNCHRONIZE ?? 'true').toLowerCase() === 'true',
        // 数据库时区，格式如 +08:00 或 -05:00
        timezone: process.env.DB_TIMEZONE ?? '+08:00',
    },
    redis: process.env.REDIS_URL,
    queue_name: process.env.QUEUE_NAME,
    secret: process.env.SECRET,
    expires_time: process.env.EXPIRES_TIME,
    system_user: process.env.SYSTEM_INIT_USER,
    system_pass: process.env.SYSTEM_INIT_PASS,
    token_prefix:process.env.TOKEN_PREFIX, // test,token前缀
}));