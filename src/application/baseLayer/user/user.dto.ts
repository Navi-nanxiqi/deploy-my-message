import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm'


export interface User {
    id: string;
    username: string;
    password: string; // 数据加密存储
    // 外部签发字段
    issuer: string;
    scope: string[];
    createAt: Date;
    updateAt: Date;
}

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryColumn({ type: 'varchar' })
    id?: string

    @Column({ type: 'varchar', length: 255 })
    username: string

    @Column({ type: 'varchar', length: 20 })
    password: string

    @Column({ name: 'create_time', type: 'varchar', length: 32 })
    create_time: string

    @Column({ name: 'update_time', type: 'varchar', length: 32 })
    update_time: string
}

export class CreateUserReqDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

