import { SetMetadata } from "@nestjs/common";

// 认证
export const IS_PUBLIC_KEY = "isPublic";
export const ApiPublic = () => SetMetadata(IS_PUBLIC_KEY, true);


// 全局权限装饰器
export const Permission = {
    // "admin" = 2,
    // "envelop_api" = 0,
    // "mail_api" = 0,
    "ADMIN": "admin",
    "TEST": "test",
    "ENVELOPAPI": "envelop_api",
    "MAILAPI": "mail_api"
}

// 权限
export const PermissionLevel = {
    [Permission.ADMIN]: 2,
    [Permission.TEST]: 1,
    [Permission.ENVELOPAPI]: 0,
    [Permission.MAILAPI]: 0,
}

export interface PermissionInjectResult {
    scopes: string[];
}
export const IS_PERMISSION_KEY = "isPermission";
export const ApiPermission = () => SetMetadata(IS_PERMISSION_KEY, true)

export const RequirePermission = (scopes: string | string[]) => {
    const data = Array.isArray(scopes) ? scopes : [scopes];
    return SetMetadata(IS_PERMISSION_KEY, {
        scopes: data
    } as PermissionInjectResult)
}



export interface AuthUser {
    id: string;
    username?: string;
    subject: string;
    issuer: string;
    scope?: string[];
    tokenId: string;
}
