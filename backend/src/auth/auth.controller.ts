import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private appService: AuthService) {}

  @Post('login')
  async getData(@Body() code: { code: string }): Promise<any> {
    return await this.appService.login(code.code);
  }

  @Get('generateTfa')
  async generateTwoFactorAuth(@Res() res) {
    return await this.appService.generateTFA(res);
  }

  @Post('verify-2fa')
  async verifyTwoFactorAuth(@Res() res, @Body() body: { input: string, secret: string } ) {
    return await this.appService.verifyTFA(res, body.input, body.secret);
  }

}
