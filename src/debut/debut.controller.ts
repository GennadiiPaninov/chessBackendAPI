import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DebutService } from './debut.service';
import { CreateDebutDto } from './dto/create-debut.dto';
import { UpdateDebutDto } from './dto/update-debut.dto';
import { User } from '../core/userDecorator/userDecorator';

@Controller('debuts')
export class DebutController {
  constructor(private readonly debutService: DebutService) {}

  @Post()
  create(@User() user: any, @Body() dto: CreateDebutDto) {
    return this.debutService.create(dto, user.sub);
  }

  @Get()
  findAll() {
    return this.debutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debutService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDebutDto) {
    return this.debutService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debutService.remove(id);
  }
}
