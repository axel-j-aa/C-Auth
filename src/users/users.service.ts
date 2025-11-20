import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/entities/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Role) private roles: Repository<Role>,
    @InjectRepository(UserRole) private userRoles: Repository<UserRole>,
  ) {}

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async create(data: Partial<User>) {
    const u = this.users.create(data);
    return await this.users.save(u);
  }

  // ✅ ahora recibe el ID del rol en lugar del code
  async ensureUserRole(userId: string, roleId: number) {
    const role = await this.roles.findOne({ where: { id: roleId } });
    if (!role) return;

    const exists = await this.userRoles.findOne({
      where: { user_id: userId, role_id: role.id },
    });

    if (!exists) {
      await this.userRoles.insert({ user_id: userId, role_id: role.id });
    }
  }

  async getRoleCodes(userId: string): Promise<string[]> {
    const rows = await this.userRoles
      .createQueryBuilder('ur')
      .innerJoin(Role, 'r', 'r.id = ur.role_id')
      .where('ur.user_id = :userId', { userId })
      .select('r.code', 'code')
      .getRawMany<{ code: string }>();

    return rows.map((r) => r.code);
  }

  // 🔹 Nuevo: obtener usuario por ID
async findById(id: string) {
  return this.users.findOne({ where: { id } });
}
  
}
