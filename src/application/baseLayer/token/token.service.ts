import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenEntity } from './token.dto';
import { CreateTokenDto } from './token.dto'
import { ConfigService } from '@nestjs/config';
import { CreateTokenRes, GetTokenRes } from './token.interface';
import { TokenStatus } from './token.dto';
import { randomUUID } from 'crypto';
import { generateUniqueId } from 'src/utils/password.trans';


@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity)
        private readonly repo: Repository<TokenEntity>,
        private readonly config: ConfigService,
    ) { }

    async createToken(dto: CreateTokenDto): Promise<TokenEntity> {
        const id = randomUUID();
        const token_data = await generateUniqueId(id);
        const expiresRaw = this.config.get<string>('app.expires_time', '3600');
        const expiresInSecondsCandidate = Number(expiresRaw);
        const expiresInSeconds = Number.isFinite(expiresInSecondsCandidate) ? expiresInSecondsCandidate : 3600;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);
        const data = this.repo.create({
            id: id,
            subject: dto.subject,
            issuer: dto.issure ? dto.issure : "system",
            scope: dto.scope ? dto.scope : [""],
            token_data: token_data,
            token_status: TokenStatus.ACTIVE,
            use_count: 0,
            expires_at: expiresInSeconds,
            create_time: now,
            expires_time: expiresAt,
            last_use_time: now
        })
        const saved = await this.repo.save(data);
        return saved;
    }

    async getToken(token: string): Promise<TokenEntity> {
        const data = await this.repo.findOne({
            where: {
                token_data: token
            }
        });
        if (!data) {
            throw new Error('Token not found')
        }
        return data
    }
}
