import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PERMISSION_KEY, Permission, PermissionLevel } from "./auth.decorator";
import { PermissionInjectResult } from "./auth.decorator";
import { IS_PUBLIC_KEY } from "./auth.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log("开始权限认证")

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log("isPublic: ", isPublic)
        if (isPublic) {
            return true;
        }
        const isPermission = this.reflector.getAllAndOverride<PermissionInjectResult>(IS_PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log("isPermission:", isPermission)

        // 检测权限配置是否存在 isPermission===undefined 表示没有权限限制
        if (isPermission === undefined) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new UnauthorizedException("用户认证失败");
        }
        const ok = this.checkPermissionScopes(user, isPermission.scopes)
        if (!ok) {
            throw new ForbiddenException("Permission denied")
        }
        console.log("权限认证成功，结束权限认证")
        return true
    }

    private checkPermissionScopes(user, requiredScopes: string[]): boolean {
        if (!user.scope || user.scope.length === 0) {
            return false;
        }

        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }

        // 检查用户是否具有任一所需权限范围或更高级别的权限
        return requiredScopes.some((requiredScope) => {
            const requiredLevel = PermissionLevel[requiredScope];
            console.log("requiredLevel:", requiredLevel)
            if (requiredLevel === undefined) {
                return false;
            }

            // 检查用户是否具有足够级别的权限范围
            return user.scope!.some((userScope) => {
                const userLevel = PermissionLevel[userScope];
                console.log("userLevel:", userLevel)
                return userLevel !== undefined && userLevel >= requiredLevel;
            });
        });
    }
}
