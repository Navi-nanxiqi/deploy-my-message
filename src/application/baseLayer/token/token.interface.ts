import { TokenStatus } from "./token.dto";
export interface TokenInfo {
    id: string,
    subject: string,
    issure: string,
    token: string,
    status: TokenStatus,
    scope: string[],
    expires: Date,
    usage_count: number,
}

export interface CreateTokenRes {
    access_token: string,
    expiresIn: number,
    tokenInfo: TokenInfo,
}

export interface GetTokenRes {
    id: string,
    subject: string,
    issuer: string,
    scope: string[],
    token_data: string,
    token_status: TokenStatus,
    use_count: number,
    expires_at: number,
    expires_time: Date,
    last_use_time: Date,
}
