import { Injectable, Res } from '@nestjs/common';
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
    private userService: UserService,
  ) {}

  async getAccessToken(code: string): Promise<string> {
    const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
    const clientId =
      'u-s4t2ud-64336f890a3d4b312905d32aa8112365980d82c1510fa0980fd301d76d844dc8';
    const clientSecret =
      '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';
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
      let payload: NonNullable<unknown>;
      const response = await axios.get(apiUrl, { headers });

      if ((await this.userService.findById(response.data.id)) === null) {
        first_co = true;
        const newUser: User = {
          id: response.data.id,
          username: response.data.login,
          img: response.data.image.link,
          tfa: false,
          secret: null,
          QRcode: null,
          elo: 0,
          win: 0,
          lose: 0,
          matchHistory: [],
          friendList: null,
          friendRequestsNb: 0,
          status: 'offline',
          gameStatus: 0,
          currentGameId: '',
          currentOpponentId: 0,
        };
        await this.userService.saveUser(newUser);
        payload = { sub: newUser.id };
      } else {
        first_co = false;
        payload = { sub: response.data.id };
      }
      return {
        jwt_token: await this.jwtService.signAsync(payload),
        first_connection: first_co,
      };
    } catch (error) {
      return null;
    }
  }

  async verifyJwt(jwt: string) {
    console.log(jwt);
    try {
      {
        return this.jwtService.verifyAsync(jwt, {
          secret: 'prout',
          ignoreExpiration: true,
        });
      }
    } catch (error) {
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
      });

      // Générer le QR code
      qrCode.toDataURL(otpAuthUrl, (err: any, imageUrl: string) => {
        if (err) {
          return res
            .status(500)
            .json({ error: 'Erreur lors de la génération du QR code' });
        }

        // Renvoyer le secret et l'URL du QR code
        res.json({ secret: secret.base32, imageUrl });
      });
    } catch (error) {
      return res.status(500).json({ error: 'Une erreur est survenue' });
    }
  }

  async verifyTFA(@Res() res, input: string, secret: string) {
    try {
      const verified = speakeasy.totp.verify({
        secret: secret,
        token: input,
      });

      if (verified) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Une erreur est survenue' });
    }
  }
}
