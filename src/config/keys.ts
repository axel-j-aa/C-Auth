// auth/src/config/keys.ts
import { readFileSync } from 'fs';
import { join } from 'path';

const normalize = (pem: string) =>
  pem.replace(/^\uFEFF/, '').replace(/\r/g, '').trim(); // quita BOM/CRLF

export const getPrivatePem = () =>
  normalize(readFileSync(join(process.cwd(), process.env.JWT_PRIVATE_PEM_PATH!), 'utf8'));

export const getPublicPem = () =>
  normalize(readFileSync(join(process.cwd(), process.env.JWT_PUBLIC_PEM_PATH!), 'utf8'));
