import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminJwtPayload } from '../types';

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload;
}
