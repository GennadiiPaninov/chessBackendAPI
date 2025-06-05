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
  create(@User() user: any, @Body() dto: CreateMoveDto) {
    return this.moveService.create(dto, user.sub);
  }

  @Get()
  findAll() {
    return this.moveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moveService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMoveDto) {
    return this.moveService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moveService.remove(id);
  }
}
