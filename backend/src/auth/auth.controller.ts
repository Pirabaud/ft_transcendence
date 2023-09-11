import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private appService: AuthService) {}

  @Post('login')
  async getData(@Body() code: { code: string }): Promise<any> {
    return await this.appService.login(code.code);
  }

  @Get('generatetfa')
  async generateTwoFactorAuth() {
    return await this.appService.generateQRcode();
  }
}
