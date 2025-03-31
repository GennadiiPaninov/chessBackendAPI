import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

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
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true; // Пропускаем аутентификацию для публичных маршрутов
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Токен не найден');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('Секрет JWT не настроен');
      }

      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
  /**
   * Извлекает JWT-токен из заголовка Authorization.
   * @param request Объект запроса Express
   * @returns Токен или undefined, если заголовок некорректен
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
