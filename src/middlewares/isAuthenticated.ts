import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

// Define uma interface para estender o objeto Request e incluir os dados do usuário
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Estende a interface Request do Express para incluir o user_id e user_role
declare module 'express' {
  interface Request {
    user_id?: string;
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // 1. Tenta pegar o token do cookie PRIMEIRO. Se não tiver, tenta do header (fallback).
  let token = req.cookies?.auth_token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [, headerToken] = authHeader.split(' ');
      token = headerToken;
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido ou cookie ausente.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';

    // 2. Verifica o token
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

    // 3. Adiciona os dados do usuário à requisição
    req.user_id = decoded.userId;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
