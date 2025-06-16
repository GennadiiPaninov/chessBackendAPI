import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Injectable()
export class MoveService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMoveDto, userId: string) {
    const { debutId, parentId } = dto;

    if (debutId && parentId) {
      throw new Error('Ход не может быть одновременно и корневым, и потомком');
    }

    let actualDebutId: string | null = null;

    if (debutId) {
      const debut = await this.prisma.debut.findUnique({
        where: { id: debutId },
      });
      if (!debut) throw new ForbiddenException('Дебют не найден');
      if (debut.ownerId !== userId)
        throw new ForbiddenException('Не ваш дебют');
      actualDebutId = debut.id;
    }

    if (parentId) {
      const parent = await this.prisma.move.findUnique({
        where: { id: parentId },
        include: { debut: true },
      });

      if (!parent) throw new ForbiddenException('Родитель не найден');
      if (!parent.debut || parent.debut.ownerId !== userId)
        throw new ForbiddenException('Не ваш дебют');

      actualDebutId = parent.debut.id;
    }

    return this.prisma.move.create({
      data: {
        title: dto.title,
        desc: dto.desc,
        notation: dto.notation,
        fen: dto.fen,
        fens: dto.fens,
        pieces: dto.pieces,
        side: dto.side,
        owner: { connect: { id: userId } },
        debut: actualDebutId ? { connect: { id: actualDebutId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });
  }
  async getRootMoves(debutId: string) {
    return this.prisma.move.findMany({
      where: {
        debutId,
        parentId: null,
      },
    });
  }
  async getChildren(parentId: string) {
    return this.prisma.move.findMany({
      where: { parentId },
    });
  }
  async update(id: string, dto: UpdateMoveDto, userId: string) {
    const move = await this.prisma.move.findUnique({
      where: { id },
    });

    if (!move) throw new ForbiddenException('Ход не найден');
    if (move.ownerId !== userId) throw new ForbiddenException('Не ваш ход');

    return this.prisma.move.update({
      where: { id },
      data: {
        desc: dto.desc,
      },
    });
  }
  async remove(id: string, userId: string) {
    const move = await this.prisma.move.findUnique({
      where: { id },
    });

    if (!move) throw new ForbiddenException('Ход не найден');
    if (move.ownerId !== userId) throw new ForbiddenException('Не ваш ход');

    return this.prisma.move.delete({
      where: { id },
    });
  }
}
