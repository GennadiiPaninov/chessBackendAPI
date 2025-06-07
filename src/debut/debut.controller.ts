import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { DebutService } from './debut.service';
import { CreateDebutDto } from './dto/create-debut.dto';
import { UpdateDebutDto } from './dto/update-debut.dto';
import { User } from '../core/userDecorator/userDecorator';

@Controller('debuts')
export class DebutController {
  constructor(private readonly debutService: DebutService) {}

  @Post()
  async create(@User() user: any, @Body() dto: CreateDebutDto) {
    return this.debutService.create(dto, user.sub);
  }

  @Get()
  async findAll(
    @User() user: any,
    @Query('my') my: string,
    @Query('title') title?: string,
  ) {
    const onlyMine = my === 'true';
    return this.debutService.findAll(user.sub, onlyMine, title);
  }

  @Get(':id')
  async findOne(@User() user: any, @Param('id') id: string) {
    return this.debutService.findOne(id, user.sub);
  }

  @Patch(':id')
  async update(
    @User() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateDebutDto,
  ) {
    return this.debutService.update(id, dto, user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: any) {
    return this.debutService.remove(id, user.sub);
  }
}
