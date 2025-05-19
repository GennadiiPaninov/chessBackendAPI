import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Injectable()
export class MoveService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMoveDto) {
    if (dto.debutId && dto.parentId) {
      throw new Error('Move cannot have both debutId and parentId');
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
