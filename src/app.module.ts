import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { UserRole } from './roles/entities/user-role.entity';
import { RefreshToken } from './tokens/entities/refresh-token.entity';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthModule } from './auth/auth.module';
import { JwksModule } from './jwks/jwks.module';

@Module({
  imports: [
    // === Cargar variables del .env ===
    ConfigModule.forRoot({ isGlobal: true }),

    // === Conexión a PostgreSQL ===
    // === Conexión a PostgreSQL ===
    TypeOrmModule.forRootAsync({
      useFactory: (): DataSourceOptions => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl:
          process.env.PG_SSL === 'true'
            ? { rejectUnauthorized: false } // necesario para Render
            : undefined, // evita error si PG_SSL=false
        entities: [User, Role, UserRole, RefreshToken],
        synchronize: false, // cámbialo a true solo en desarrollo
        logging: true, // puedes activarlo para depurar
      }),
    }),

    // === Módulos del sistema ===
    UsersModule,
    RolesModule,
    TokensModule,
    AuthModule,
    JwksModule,
  ],
})
export class AppModule {}
