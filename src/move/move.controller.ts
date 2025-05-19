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

@Controller('moves')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  create(@Body() dto: CreateMoveDto) {
    return this.moveService.create(dto);
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
