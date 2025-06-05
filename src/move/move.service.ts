import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Injectable()
export class MoveService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMoveDto, userId: string) {
    if (dto.debutId && dto.parentId) {
      throw new Error('Move cannot have both debutId and parentId');
    }

    if (dto.debutId) {
      const debut = await this.prisma.debut.findUnique({
        where: { id: dto.debutId },
      });

      if (!debut) {
        throw new ForbiddenException('Такого дебюта не существует');
      }

      if (debut.ownerId !== userId) {
        throw new ForbiddenException(
          'Вы не можете добавлять ходы в чужой дебют',
        );
      }
    }

    if (dto.parentId) {
      const parentMove = await this.prisma.move.findUnique({
        where: { id: dto.parentId },
        include: {
          debut: {
            select: { ownerId: true },
          },
        },
      });

      if (!parentMove) {
        throw new ForbiddenException('Родительский ход не найден');
      }

      if (!parentMove.debut) {
        throw new ForbiddenException('Родительский ход не привязан к дебюту');
      }

      if (parentMove.debut.ownerId !== userId) {
        throw new ForbiddenException(
          'Вы не можете добавлять ходы в чужой дебют',
        );
      }
    }

    return this.prisma.move.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        notation: dto.notation,
        debutId: dto.debutId,
        parentId: dto.parentId,
      },
    });
  }

  findAll() {
    return this.prisma.move.findMany({
      include: {
        children: true,
        parent: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.move.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  update(id: string, dto: UpdateMoveDto) {
    return this.prisma.move.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.move.delete({
      where: { id },
    });
  }
}
