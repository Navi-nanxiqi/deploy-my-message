import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity, CreateUserReqDto } from './user.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { formatWithTimezone } from 'src/utils/time.methods';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>,
        private readonly config: ConfigService,
    ) { }

    async onModuleInit() {
        await this.initSystemUser();
    }
    async initSystemUser() {
        const user = await this.repo.findOne({ where: { username: String(this.config.get<string>("app.system_name")) } });
        if (user) {
            console.log("system has already exist")
        } else {
            const payload: CreateUserReqDto = {
                username: String(this.config.get<string>("app.system_name")),
                password: String(this.config.get<string>("app.system_pass"))
            }
            await this.createUser(payload)
        }
    }

    async createUser(dto: CreateUserReqDto): Promise<UserEntity> {
        const id = randomUUID();
        const tz = this.config.get<string>('app.db.timezone', '+08:00');
        const now = new Date();
        const data = this.repo.create({
            id: id,
            username: dto.username,
            password: dto.password,
            create_time: formatWithTimezone(now, tz),
            update_time: formatWithTimezone(now, tz)
        })
        const saved = await this.repo.save(data);
        return saved;
    }

    async getUser(id: string): Promise<UserEntity> {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new Error("user is not exist")
        }
        return user;
    }

    async validateUser(username: string, password: string): Promise<UserEntity> {
        const user = await this.repo.findOne({ where: { username } })
        if (!user) {
            throw new Error("user is not exist")
        }
        if (user.password !== password) {
            throw new Error("user or password is error")
        }
        return user;
    }
}
