import { Injectable } from '@nestjs/common';
import { exportJWK, importSPKI } from 'jose';
import { getPublicPem } from '../config/keys';

@Injectable()
export class JwksService {
  async getJwks() {
    const publicKey = await importSPKI(getPublicPem(), 'RS256');
    const jwk = await exportJWK(publicKey);
    (jwk as any).kid = process.env.JWT_KID!;
    (jwk as any).alg = 'RS256';
    (jwk as any).use = 'sig';
    return { keys: [jwk] };
  }
}
