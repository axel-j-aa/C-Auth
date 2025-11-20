import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roles: Repository<Role>) {}

  findByCode(code: string) {
    return this.roles.findOne({ where: { code } });
  }
}
