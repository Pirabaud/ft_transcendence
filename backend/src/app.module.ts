import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { DatabaseModule } from './database/database.module';
import { GameHistory } from './game/game.entity';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      username: 'user',
      password: 'password',
      database: 'database',
      entities: [User, GameHistory],
      synchronize: true,
    }),
    UserModule,
    GameModule,
    DatabaseModule,
    MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
