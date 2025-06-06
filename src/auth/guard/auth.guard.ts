import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

/**
 * Guard для проверки JWT-токена в запросах.
 * Проверяет наличие и валидность токена, извлекает payload и добавляет его в запрос.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Проверяет, может ли запрос быть выполнен на основе JWT-аутентификации и публичности маршрута.
   * @param context Контекст выполнения запроса
   * @returns Promise<boolean> Разрешение или отказ в доступе
   * @throws UnauthorizedException Если токен отсутствует или недействителен
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Проверяем, является ли маршрут публичным (не требует аутентификации)
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true; // Пропускаем аутентификацию для публичных маршрутов
    }

    const request = context.switchToHttp().getRequest<Request>();
    console.log('Cookies:', request.cookies);
    // Извлекаем access-токен из заголовка Authorization
    const token = this.extractTokenFromHeader(request) || request.cookies['access_token'];

    try {
      let payload;

      if (token) {
        // Если access-токен найден, проверяем его валидность

        console.log('Access token payload1:', payload);
        console.log('isEmailConfirmed1:', payload?.isEmailConfirmed);
        payload = await this.verifyToken(
          token,
          this.configService.get<string>('JWT_SECRET'),
        );
        console.log('Access token payload2:', payload);
        console.log('isEmailConfirmed2:', payload?.isEmailConfirmed);
      } else {
        // Если access-токен отсутствует, проверяем наличие refresh-токена в cookies
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) {
          throw new UnauthorizedException('Токен не найден');
        }

        // Проверяем refresh-токен
        payload = await this.verifyToken(
          refreshToken,
          this.configService.get<string>('JWT_SECRET'),
        );
      }

      // Дополнительная проверка подтверждения email
      if (!payload.isEmailConfirmed) {
        throw new ForbiddenException('Email не подтверждён');
      }

      request['user'] = payload; // Добавляем данные пользователя в объект запроса
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Token expired');
        throw new UnauthorizedException('Токен истек');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        console.log('Invalid token:', error.message);
        throw new UnauthorizedException('Неверный токен');
      }

      console.log('Unexpected JWT error:', error);
      throw new UnauthorizedException('Ошибка валидации токена1');
    }
  }

  /**
   * Извлекает JWT-токен из заголовка Authorization.
   * @param request Объект запроса Express
   * @returns Токен или undefined, если заголовок отсутствует или имеет некорректный формат
   * @throws UnauthorizedException Если заголовок Authorization имеет неверный формат
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Некорректный формат токена');
    }
    return parts[1];
  }

  /**
   * Проверяет валидность переданного JWT-токена.
   * @param token Строка с JWT-токеном
   * @param secret Секретный ключ для валидации токена
   * @returns Promise<any> Декодированные данные из токена (payload)
   * @throws UnauthorizedException Если токен недействителен, истек или имеет неверный формат
   */
  private async verifyToken(token: string, secret: string) {
    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      console.error('JWT verification failed:', error);

      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Токен истек');
      }

      if (error?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Некорректный токен');
      }

      throw new UnauthorizedException('Ошибка валидации токена');
    }
  }
}
