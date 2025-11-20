import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { randomUUID, createHash } from 'crypto';
import { add } from 'date-fns';

@Injectable()
export class TokensService {
  constructor(@InjectRepository(RefreshToken) private repo: Repository<RefreshToken>) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async mint(user_id: string, family_id: string) {
    const raw = randomUUID() + '.' + randomUUID();
    const token_hash = this.hashToken(raw);
    const expires_at = add(new Date(), { days: Number(process.env.RT_DAYS || 7) });

    await this.repo.insert({
      user_id, family_id, token_hash, expires_at, issued_at: new Date()
    });
    return raw;
  }

  async consume(raw: string) {
    const token_hash = this.hashToken(raw);
    const rt = await this.repo.findOne({ where: { token_hash } });
    if (!rt || rt.is_revoked || rt.expires_at < new Date()) return null;
    rt.is_revoked = true;
    await this.repo.save(rt);
    return rt;
  }
}
