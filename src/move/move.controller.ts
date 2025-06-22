import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MoveService } from './move.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { User } from '../core/userDecorator/userDecorator';

@Controller('moves')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  async create(@User() user: any, @Body() dto: CreateMoveDto) {
    return this.moveService.create(dto, user.sub);
  }
  @Get(':id')
  async getMove(@User() user: any, @Param('id') id: string) {
    return this.moveService.getMove(user.sub, id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User() user: any,
    @Body() dto: UpdateMoveDto,
  ) {
    return this.moveService.update(id, dto, user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    return this.moveService.remove(id, user.sub);
  }
}
