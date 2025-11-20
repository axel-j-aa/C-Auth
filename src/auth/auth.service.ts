import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { TokensService } from '../tokens/tokens.service';
import { SignJWT, importPKCS8 } from 'jose';
import { getPrivatePem } from '../config/keys';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokensService
  ) {}

    // =====================
  // 🧾 REGISTRO
  // =====================
  async register(
    email: string,
    password: string,
    full_name?: string,
    role?: string
  ) {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException('Email ya registrado');

    const password_hash = await argon2.hash(password);
    const user = await this.users.create({ email, password_hash, full_name });

    // ✅ Asigna el rol numérico según la BD:
    // 1 = Usuario, 3 = Conductor
    let roleId = 1;
    if (role === 'CONDUCTOR' || role === 'DRIVER' || role === '3') {
      roleId = 3;
    }

    await this.users.ensureUserRole(user.id, roleId);

    const { access_token, refresh_token } = await this.issueTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_id: roleId,
      },
      access_token,
      refresh_token,
    };
  }

    // =====================
  // 🔐 LOGIN
  // =====================
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('📧 Usuario encontrado:', user.email);
    console.log('🧩 Hash guardado en BD:', user.password_hash);

    const ok = await argon2.verify(user.password_hash, password);
    console.log('✅ Resultado de verificación:', ok);

    if (!ok) {
      console.log('🚫 Contraseña incorrecta para el usuario:', user.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('🎟️ Credenciales correctas. Generando tokens...');

    const { access_token, refresh_token } = await this.issueTokens(user.id);

    // === Obtener rol del usuario ===
    const roleCodes = await this.users.getRoleCodes(user.id);
    const roleValue = Array.isArray(roleCodes) ? roleCodes[0] : roleCodes;

    // === Traducir rol a número ===
    let roleNumber: number;
    if (roleValue === 'USER' || roleValue === '1') roleNumber = 1;
    else if (roleValue === 'DRIVER' || roleValue === '3') roleNumber = 3;
    else roleNumber = 0; // sin rol definido

    console.log(
      '🧾 Rol del usuario:',
      roleValue,
      '(→ numérico:',
      roleNumber,
      ')'
    );
    console.log('🎉 Login exitoso para:', user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: roleNumber,
      },
      access_token,
      refresh_token,
    };
  }

  // =====================
  // 🔁 REFRESCAR TOKEN
  // =====================
  async refresh(userId: string, presentedRt: string) {
    const used = await this.tokens.consume(presentedRt);
    if (!used) throw new UnauthorizedException('Refresh token inválido');

    const { access_token } = await this.issueAccess(userId, used.family_id);
    return { access_token };
  }

  // =====================
  // 🎟️ EMISIÓN DE TOKENS
  // =====================
  private async issueTokens(userId: string) {
    const family_id = randomUUID();
    const { access_token } = await this.issueAccess(userId, family_id);
    const refresh_token = await this.tokens.mint(userId, family_id);
    return { access_token, refresh_token };
  }

  private async issueAccess(userId: string, family_id: string) {
    const alg = 'RS256';
    const privateKey = await importPKCS8(getPrivatePem(), alg);
    const now = Math.floor(Date.now() / 1000);

    const roles = await this.users.getRoleCodes(userId);

    const jwt = await new SignJWT({
      sub: userId,
      typ: 'access',
      family: family_id,
      roles,
    })
      .setProtectedHeader({ alg, kid: process.env.JWT_KID! })
      .setIssuer(process.env.JWT_ISSUER!)
      .setAudience(process.env.JWT_AUDIENCE!)
      .setIssuedAt(now)
      .setExpirationTime(process.env.JWT_EXPIRES || '1d')
      .sign(privateKey);

    return { access_token: jwt };
  }

async getUserById(id: string) {
  const user = await this.users.findById(id);
  if (!user) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }
  const { password_hash, ...safe } = user as any; // oculta el hash
  return safe;
}

}
