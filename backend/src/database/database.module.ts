import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [DatabaseController],
  providers: [UserService],
})
export class DatabaseModule {}
