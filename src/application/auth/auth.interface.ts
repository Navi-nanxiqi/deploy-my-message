import { TokenStatus } from "../baseLayer/token/token.dto"
export interface HandelRegisterRes {
    message: string
}
export interface HandelLoginRes {
    access_token: string,
}

export interface AuthUserResultRes {
    id?: string
    username: string
    password: string
    issuer: string
    scope: string[]
}

export interface AuthTokenResultRes {
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