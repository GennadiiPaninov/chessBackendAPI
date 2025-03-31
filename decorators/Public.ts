import { SetMetadata } from '@nestjs/common';
/**
 * Декоратор, который добавляет isPublic=true, необходимо
 * для того чтобы глобальная проверка на наличие access token не запрещала доступ к  /login .
 */
export const Public = () => SetMetadata('isPublic', true);
