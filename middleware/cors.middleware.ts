import { NextFunction, Request, Response } from 'express';

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const allowedOrigins = [
    'http://localhost:4200',
    'https://chess-angular-topaz.vercel.app',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Для preflight OPTIONS запросов отвечаем сразу
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
