import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}
  private accessToken: any = null;
  private data: any = null;

  @Post('login')
  async getData(@Body() code: { code: string}): Promise<any> {
    console.log("code :", code.code)
    return await this.appService.login(code.code);
  }

  // @Post('signin')
  // async getToken(@Body() code: { code: string}): Promise<Boolean> {
  //   const token: string = await this.appService.signin(code.code);
  //   this.accessToken = { token: token };
  //   console.log('token return');
  //   if (this.accessToken.token)
  //     return true;
  //   else
  //     return  false;
  // }

    // @UseGuards(JwtAuthGuard)
    // @Get('profile')
    // getProfile(@Request() req) {
    //     console.log(req.user);
    //     return req.user;
    //   }  
    }