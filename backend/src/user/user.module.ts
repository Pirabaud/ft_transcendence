import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { GameModule } from 'src/game/game.module';

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    providers: [UserService],
})
export class UserModule {}
