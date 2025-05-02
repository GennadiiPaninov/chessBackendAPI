import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { EmailService } from '../core/email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Аутентифицирует пользователя, возвращает JWT-токен и добавляет к cookie refresh_token.
   * @param email Электронная почта пользователя
   * @param pass Пароль пользователя
   * @returns Объект с access-токеном
   * @throws UnauthorizedException при неверных учетных данных
   */
  async signIn(
    email: string,
    pass: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    await this.usersService.updateRefreshToken(user.id, refresh_token);

    // Устанавливаем refresh-токен в HttpOnly cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    console.log('Попал, res, закончился', access_token, refresh_token);
    return {
      access_token,
    };
  }

  /**
   * Регистрирует пользователя, возвращает статускод и направляет письмо на email.
   * @param email Электронная почта пользователя
   * @param pass Пароль пользователя
   * @returns статускод
   * @throws UnauthorizedException при неверных учетных данных
   */

  async signUp(email: string, pass: string): Promise<{ message: string }> {
    const existingUser = await this.usersService.findOne(email);
    if (existingUser) {
      throw new UnauthorizedException('Пользователь уже существует');
    }

    const newUser = await this.usersService.createUser({
      email,
      password: pass,
    });

    await this.emailService.sendVerificationEmail(
      newUser.email,
      newUser.emailConfirmToken,
    );

    return { message: 'Письмо с подтверждением отправлено на почту' };
  }
  async confirmEmail(token: string) {
    const user = await this.usersService.findByConfirmToken(token);
    if (!user) {
      throw new UnauthorizedException('Некорректный токен');
    }
    await this.usersService.update(user.id, {
      isEmailConfirmed: true,
      emailConfirmToken: null,
    });
    return { message: 'Email подтверждён' };
  }
  async refreshAccessToken(
    refresh_token: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refresh_token);
      const user = await this.usersService.findOneId(decoded.sub);

      if (!user || user.refreshToken !== refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { sub: user.id };
      const new_access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      });
      const new_refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      // Обновляем refresh-токен в базе
      await this.usersService.updateRefreshToken(user.id, new_refresh_token);

      // Устанавливаем новый refresh-токен в куку
      res.cookie('refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh',
      });

      return { access_token: new_access_token };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async clearToken(req: Request, res: Response) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) {
      throw new UnauthorizedException('No refresh token found');
    }

    // Декодируем токен, чтобы получить ID пользователя
    const decoded = await this.jwtService.verifyAsync(refresh_token);
    await this.usersService.update(decoded.sub, { refreshToken: null });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out' };
  }
}
