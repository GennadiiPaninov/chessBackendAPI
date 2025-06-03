import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDebutDto } from './dto/create-debut.dto';
import { UpdateDebutDto } from './dto/update-debut.dto';
import { DebutWhereInput } from "../auth/dto/sign-in.dto";

@Injectable()
export class DebutService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDebutDto, user: string) {
    return this.prisma.debut.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        owner: { connect: { id: user } },
        side: dto.side,
      },
    });
  }

  async findAll(userId: string, onlyMine: boolean = false, title?: string) {
    const where: DebutWhereInput = {};

    if (onlyMine) {
      where.ownerId = userId;
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }
    return this.prisma.debut.findMany({
      where,
      include: {
        firstMoves: {
          include: { children: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.debut.findUnique({
      where: { id },
      include: {
        firstMoves: {
          include: { children: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateDebutDto, userId) {
    const debut = await this.prisma.debut.findUnique({ where: { id } });
    if (!debut) {
      throw new ForbiddenException('Дебют не найден');
    }

    if (debut.ownerId !== userId) {
      throw new ForbiddenException('Вы не можете обновить чужой дебют');
    }

    return this.prisma.debut.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const debut = await this.prisma.debut.findUnique({ where: { id } });

    if (!debut) {
      throw new ForbiddenException('Дебют не найден');
    }

    if (debut.ownerId !== userId) {
      throw new ForbiddenException('Вы не можете удалить чужой дебют');
    }

    return this.prisma.debut.delete({ where: { id } });
  }
}
