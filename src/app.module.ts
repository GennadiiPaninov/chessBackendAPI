import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DebutModule } from './debut/debut.module';
import { MoveModule } from './move/move.module';

@Module({
  imports: [UsersModule, AuthModule, DebutModule, MoveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
