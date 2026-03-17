import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'

export enum TokenStatus {
    "ACTIVE" = "active",
    "EXPIRES" = "expires",
    "REVOKE" = "revoke",
}

export interface Token {
    id: string;
    type: string;
    subject: string; // 该值通常为 userid "user123"
    issure: string; // 签发者:调用创建随机token模块名称 "system"
    scope: string; // token需要授权的系统 my_api
    tokenData: string; // token元数据 hash(token)
    tokenStatus: TokenStatus; // 该token的状态
    useCount: number; // 该token使用次数
    expiresTime: number; // token过期时间 (单位：s)
    createAt: Date; // 创建时间
    expiresAt: Date; // 过期时间
    lastUsedAt?: Date; // 最后一次使用时间
}


export interface CreateTokenDto {
    subject: string;
    issure?: string;
    scope?: string[];
}

@Entity({ name: 'token' })
export class TokenEntity {
    @PrimaryColumn()
    id: string

    // @Column({ type: 'varchar', length: 255 })
    // type: TokenType

    @Column()
    subject: string


    @Column()
    issuer: string

    @Column('simple-array')
    scope: string[]

    @Column()
    token_data: string

    @Column()
    token_status: TokenStatus

    @Column()
    use_count: number

    @Column()
    expires_at: number

    @Column({ type: 'datetime' })
    create_time: Date

    @Column({ type: 'datetime' })
    expires_time: Date

    @Column({ type: 'datetime' })
    last_use_time: Date
}
