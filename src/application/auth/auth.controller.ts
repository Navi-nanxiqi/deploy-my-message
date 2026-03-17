import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { HandelRegisterReqDto, HandelLoginReqDto } from './auth.dto';
import { ApiPublic } from 'src/utils/auth/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }
  @Post("register")
  @ApiPublic()
  handelRegister(@Body() dto: HandelRegisterReqDto) {
    return this.authService.handelRegister(dto);
  }

  @Post("login")
  @ApiPublic()
  async handelLogin(@Body() dto: HandelLoginReqDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.handelLogin(dto);
    console.log(token)
    res.cookie("test", token.access_token, {
      httpOnly: true, // 防止客户端使用js获取到cookie,避免xss攻击
      sameSite: "strict", // 让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）
      expires: token.expires_at,
    });
    return "cookie set successfully"
  }

  @Post("logout")
  @ApiPublic()
  async handelLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("test")
  }

  @Get("session")
  @ApiPublic()
  async handelSession(@Req() req) {
    return req.user ? { data: true } : { data: false };
  }

  @Get("test")
  @ApiPublic()
  handelTest() {
    const data = { code: 200, data: "success" };
    console.log(data);
    return data
  }
}
