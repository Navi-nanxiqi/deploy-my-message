import { Injectable } from '@nestjs/common';
import { TokenService } from '../baseLayer/token/token.service';
import { UserService } from '../baseLayer/user/user.service';
import { HandelLoginReqDto, HandelRegisterReqDto } from './auth.dto';
import { CreateTokenDto } from '../baseLayer/token/token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly config: ConfigService,
    ) { }
    async handelRegister(dto: HandelRegisterReqDto) {
        await this.userService.createUser(dto);
        return {
            message: "register successfully"
        }
    }
    async handelLogin(dto: HandelLoginReqDto) {
        const user = await this.userService.validateUser(dto.username, dto.password);
        var data: CreateTokenDto;
        if (dto.username === this.config.get<string>("system_user") && dto.password === this.config.get<string>("system_pass")) {
            data = {
                subject: String(user.id),
                issure: "system_init",
                scope: ["admin"]
            }
        } else {
            data = {
                subject: String(user.id),
                issure: String(user.username),
                scope: [""]
            }
        }
        const token_res = await this.tokenService.createToken(data);
        const timeStr = String(token_res.expires_at);
        const standardStr = timeStr.replace(" ", "T");
        const time = new Date(standardStr);
        return {
            access_token: token_res.token_data,
            expires_at:time
        };
    }

    async getUserInfo(id: string) {
        return this.userService.getUser(id);
    }

    async getTokenInfo(token: string) {
        return await this.tokenService.getToken(token);
    }

}
