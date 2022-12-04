// lib/cookie.js

import { serialize } from 'cookie';
import { NextApiResponse } from 'next';
import { LoginResponseData } from '../pages/api/login';

const TOKEN_NAME = 'api_token';
const MAX_AGE = 60 * 60 * 8;

function createCookie(name: string, data: string, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    ...options,
  });
}

function setTokenCookie(res: NextApiResponse<LoginResponseData>, token: string) {
  res.setHeader('Set-Cookie', [
    createCookie(TOKEN_NAME, token),
    createCookie('authed', 'true', { httpOnly: false }),
  ]);
}

function getAuthToken(cookies: Partial<{ [key: string]: string; }>): string {
  return cookies[TOKEN_NAME] ?? '';
}

const exports = { setTokenCookie, getAuthToken };
export default exports;