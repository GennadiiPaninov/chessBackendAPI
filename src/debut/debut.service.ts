import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDebutDto } from './dto/create-debut.dto';
import { UpdateDebutDto } from './dto/update-debut.dto';

@Injectable()
export class DebutService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateDebutDto, user: string) {
    return this.prisma.debut.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        owner: { connect: { id: user } },
        side: dto.side,
      },
    });
  }

  findAll() {
    return this.prisma.debut.findMany({
      include: {
        firstMoves: {
          include: { children: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.debut.findUnique({
      where: { id },
      include: {
        firstMoves: {
          include: { children: true },
        },
      },
    });
  }

  update(id: string, dto: UpdateDebutDto) {
    return this.prisma.debut.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.debut.delete({
      where: { id },
    });
  }
}
