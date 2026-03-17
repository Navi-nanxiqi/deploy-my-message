import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../baseLayer/token/token.module';
import { UserModule } from '../baseLayer/user/user.module';
import { UserService } from '../baseLayer/user/user.service';

@Module({
  imports: [
    TokenModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
