import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signupUser(@Body() userDto: SignUpUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
  @Get(':email')
  async findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
