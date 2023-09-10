import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { GamesUtileService } from './gameUtiles.service';
import { GameService } from './game.service';
import { GameCalculation } from './gameCalculation';
import { GamePortal } from './gamePortal.service';
import { GameDatabase } from './gameDatabase.service';
import { GameHistory } from './game.entity';

@Module({
  imports: [GameModule, AuthModule, UserModule, TypeOrmModule.forFeature([User, GameHistory])],
  providers: [GameGateway, 
    AuthService, 
    GameService, 
    UserService, 
    GamesUtileService, 
    GamePortal, 
    GameCalculation,
    GameDatabase,
  ]
})
export class GameModule {}
