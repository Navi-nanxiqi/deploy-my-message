import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenEntity } from './token.dto'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule { }
