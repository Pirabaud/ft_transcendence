import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
  
    constructor(private readonly jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
  
      if (token) {
        try {
          // this.logger.debug(`Received token: ${token}`);
          const decoded = await this.jwtService.verifyAsync(token);
          // this.logger.debug('Decoded user data:', decoded);
          request.user = decoded;
          return true;
        } catch (err) {
          this.logger.error('Error while verifying token:', err);
          return false;
        }
      }
  
      this.logger.warn('No token found in headers');
      return false;
    }
  }
 