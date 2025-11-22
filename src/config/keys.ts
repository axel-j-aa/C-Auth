//USAR EN LOCAL CON VARIABLES DE ENTORNO

// auth/src/config/keys.ts
//import { readFileSync } from 'fs';
//import { join } from 'path';

//const normalize = (pem: string) =>
//pem.replace(/^\uFEFF/, '').replace(/\r/g, '').trim(); // quita BOM/CRLF

//export const getPrivatePem = () =>
//normalize(readFileSync(join(process.cwd(), process.env.JWT_PRIVATE_PEM_PATH!), 'utf8'));

//export const getPublicPem = () =>
//normalize(readFileSync(join(process.cwd(), process.env.JWT_PUBLIC_PEM_PATH!), 'utf8'));


//USAR CUANDO ESTE EN RENDER

// auth/src/config/keys.ts
import { readFileSync } from 'fs';

const normalize = (pem: string) =>
  pem.replace(/^\uFEFF/, '').replace(/\r/g, '').trim();

export const getPrivatePem = () =>
  normalize(readFileSync('/etc/secrets/private.pem', 'utf8'));

export const getPublicPem = () =>
  normalize(readFileSync('/etc/secrets/public.pem', 'utf8'));
