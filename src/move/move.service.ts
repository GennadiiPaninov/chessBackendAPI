import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Injectable()
export class MoveService {
  constructor(private prisma: PrismaService) {}

  async getMove(userId: string, moveId: string) {
    const move = await this.prisma.move.findUnique({
      where: { id: moveId },
      include: {
        owner: { select: { id: true } },
        children: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            title: true,
            desc: true,
            notation: true,
            fen: true,
            fens: true,
            pieces: true,
            side: true,
            createdAt: true,
            ownerId: true,
          },
        },
      },
    });

    if (!move) {
      throw new ForbiddenException('Ход не найден');
    }
    if (!move) throw new ForbiddenException('Ход не найден');

    return {
      id: move.id,
      title: move.title,
      desc: move.desc,
      notation: move.notation,
      fen: move.fen,
      fens: move.fens,
      pieces: move.pieces,
      side: move.side,
      createdAt: move.createdAt,
      isMine: move.owner.id === userId,
      children: move.children.map((child) => ({
        id: child.id,
        title: child.title,
        desc: child.desc,
        notation: child.notation,
        fen: child.fen,
        fens: child.fens,
        pieces: child.pieces,
        side: child.side,
        createdAt: child.createdAt,
      })),
    };
  }
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
        ...(parentId
          ? {
              parent: { connect: { id: parentId } },
            }
          : {
              debut: { connect: { id: actualDebutId! } },
            }),
      },
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
