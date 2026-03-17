import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthUser, IS_PUBLIC_KEY } from "./auth.decorator";
import { AuthService } from "src/application/auth/auth.service";
import { TokenStatus } from "src/application/baseLayer/token/token.dto";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("开始登录认证")
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log("isPublic: ", isPublic)
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        console.log(token)
        if (!token) {
            throw new UnauthorizedException("Access Token Not Exist");
        }
        try {
            // 根据token-》token该条记录-》user该条记录-》将token与user添加到request中
            const list = await this.authService.getTokenInfo(token);
            console.log("list:", list)
            if (!list) {
                throw new Error("Get Token error")
            }
            if (list.token_status != TokenStatus.ACTIVE) {
                throw new Error("token is not active")
            }
            if (list.expires_time < new Date() || list.token_status != TokenStatus.ACTIVE) {
                throw new Error("token has expired")
            }

            const user = await this.authService.getUserInfo(list.subject)
            console.log("user:", user)

            var data: AuthUser = {
                id: String(user.id),
                username: user.username,
                subject: list.subject,
                issuer: list.issuer,
                scope: list.scope,
                tokenId: list.id
            };
            request.user = data;
            request.token = token;
        }
        catch {
            throw new UnauthorizedException();
        }
        console.log("登录认证成功，结束登入认证")
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // token 外部签发token的获取
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        if(type==="Bearer" && token){
            return token;
        }

        // 系统内部用户的cookie获取
        const cookie = request.cookies;
        if (cookie && typeof cookie === "object") {
            const authKey = Object.keys(cookie);
            if (authKey) {
                const rawCookieVal = cookie["test"];
                if (rawCookieVal) {
                    const trimmedCookie = rawCookieVal.trim();
                    if (trimmedCookie) {
                        return trimmedCookie
                    }
                }
            }
        }
        return undefined;
    }
}
