import { Module } from '@nestjs/common';
import { DebutService } from './debut.service';
import { DebutController } from './debut.controller';

@Module({
  controllers: [DebutController],
  providers: [DebutService],
})
export class DebutModule {}
