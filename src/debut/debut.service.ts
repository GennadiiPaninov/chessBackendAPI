import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDebutDto } from './dto/create-debut.dto';
import { UpdateDebutDto } from './dto/update-debut.dto';
import { DebutWhereInput } from '../auth/dto/sign-in.dto';

@Injectable()
export class DebutService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDebutDto, userId: string) {
    const exists = await this.prisma.debut.findFirst({
      where: {
        title: dto.title,
      },
    });

    if (exists) {
      throw new ForbiddenException('Дебют с таким названием уже есть в базе.');
    }

    return this.prisma.debut.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        owner: { connect: { id: userId } },
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

    const debuts = await this.prisma.debut.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
          },
        },
      },
    });

    return debuts.map((debut) => {
      const { owner, ...rest } = debut;
      return {
        ...rest,
        isMine: owner.id === userId,
      };
    });
  }

  async findOne(id: string, userId: string) {
    const debut = await this.prisma.debut.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true },
        },
        firstMoves: true,
      },
    });

    if (!debut) {
      throw new ForbiddenException('Дебют не найден');
    }

    const { owner, ...rest } = debut;

    return {
      ...rest,
      isMine: owner.id === userId,
    };
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
