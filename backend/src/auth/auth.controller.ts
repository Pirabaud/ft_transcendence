import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}
  private accessToken: any = null;
  private data: any = null;

  @Post('login')
  async getData(@Body() code: { code: string}): Promise<any> {
    return await this.appService.login(code.code);
  }
}