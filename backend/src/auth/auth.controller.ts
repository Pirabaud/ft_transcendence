import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';

@Controller('auth')
export class AuthController {
  constructor(private appService: AuthService) {}

  @Post('login')
  async getData(@Body() code: { code: string }): Promise<any> {
    return await this.appService.login(code.code);
  }

  @Get('generateTfa')
  async generateTwoFactorAuth(@Res() res) {
    try {
      // Générer une clé secrète
      const secret = speakeasy.generateSecret();
  
      // Générer un URI pour le QR code
      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'Transcendence',
        issuer: 'Transcendence',
      });
      
      // Générer le QR code
      qrCode.toDataURL(otpAuthUrl, (err: any, imageUrl: string) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la génération du QR code' });
        }
        
        // Renvoyer le secret et l'URL du QR code
        res.json({ secret: secret.base32, imageUrl });
      });
      
    } catch (error) {
      return res.status(500).json({ error: 'Une erreur est survenue' });
    }
  }
}
