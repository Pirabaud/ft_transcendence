import { Injectable, Res, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';

@Injectable()
export class AuthService {

  constructor(
     private jwtService: JwtService,
     private userService: UserService
  ) {}

  
  async getAccessToken(code: string): Promise<string> {
    const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
    const clientId = 'u-s4t2ud-64336f890a3d4b312905d32aa8112365980d82c1510fa0980fd301d76d844dc8';
    const clientSecret = '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';
    const redirectUri = 'http://localhost:4200/login-handler';

    try {
        const response = await axios.post(tokenEndpoint, {
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      });
      return response.data.access_token;
    } catch (error) {
      return null;
    }
  }

  async login(code: string) {
  const access_token = await this.getAccessToken(code);
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const apiUrl = 'https://api.intra.42.fr/v2/me';
  let first_co = false;

  try {
     let payload = {};
    const response = await axios.get(apiUrl, { headers });
    if (await this.userService.findOne(response.data.id) === null) {
      first_co = true;
      const newUser: User = new User();
      newUser.id = response.data.id;
      newUser.login = response.data.login;
      newUser.img = response.data.image.link;
      newUser.tfa = false;
      newUser.secret = null;
      newUser.QRcode = null;
      await this.userService.save(newUser);
      payload = {sub: newUser.id}
    }
    else
    {
      first_co = false;
      payload = {sub: response.data.id}
    }
    return { jwt_token: await this.jwtService.signAsync(payload), first_connection: first_co };
  }
   catch (error) {
    return null;
  }
}

async verifyJwt(jwt: string) {
  try {
  {
    return this.jwtService.verifyAsync(
     jwt,
     {
       secret: 'prout',
       ignoreExpiration: true,
     },
   );
  }
  }
  catch (error) {
      console.log(error);
     return null;
  }
}

async generateTFA(@Res() res) {
  try {
    // Générer une clé secrète
    const secret = speakeasy.generateSecret();

    // Générer un URI pour le QR code
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: 'Transcendence',
      // issuer: '',
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