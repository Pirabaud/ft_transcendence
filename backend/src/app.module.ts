import { Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { GameHistory } from './game/game.entity';
import { MatchesModule } from './matches/matches.module';
import { FriendRequestModule } from './friendRequest/friendRequestModule';
import { FriendRequest } from './friendRequest/friendRequest.entity';
import { ProxyController } from './proxy/proxy.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './../../.env',
      }),
      TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'postgres',
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, GameHistory, FriendRequest],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    GameModule,
    MatchesModule,
    FriendRequestModule,
  ],
  controllers: [AppController, ProxyController],
  providers: [AppService],
})
export class AppModule {}
