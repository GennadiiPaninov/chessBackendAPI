import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    const emailConfirmToken = uuidv4();
    console.log(data);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        emailConfirmToken,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async remove(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Пользователь с id ${id} не найден.`);
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findOneId(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const saltRounds = 10;
    const hashedToken = await bcrypt.hash(refreshToken, saltRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
    return;
  }

  async update(id: string, obj: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id: id },
      data: obj,
    });
    return;
  }
  async findByConfirmToken(token: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { emailConfirmToken: token },
    });
  }
}
