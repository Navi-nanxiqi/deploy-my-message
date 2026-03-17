import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'queue' })
export class QueueEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 20 })
  status: string

  // 数据对象为 task 实体
  @Column({ type: 'text' })
  data: any

  @Column({ name: 'create_time', type: 'varchar', length: 32 })
  create_time: string

  @Column({ name: 'update_time', type: 'varchar', length: 32 })
  update_time: string
}

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

