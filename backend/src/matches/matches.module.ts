import { Module } from '@nestjs/common';
import { MatchesController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { MatchesService } from './matches.service';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [MatchesController],
    imports: [TypeOrmModule.forFeature([User, GameHistory]), UserModule, AuthModule],
    providers: [MatchesService, UserService],
})
export class MatchesModule {}
