import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MoveController } from './move.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MoveController],
  providers: [MoveService, PrismaService],
})
export class MoveModule {}
