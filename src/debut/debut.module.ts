import { Module } from '@nestjs/common';
import { DebutService } from './debut.service';
import { DebutController } from './debut.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DebutController],
  providers: [DebutService, PrismaService],
})
export class DebutModule {}
