import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  // ✅ Recibe también el rol que viene desde el frontend
  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.full_name, dto.role);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('auth/refresh')
  refresh(@Body() dto: RefreshDto) {
    const maybeUserId = undefined as any;
    return this.auth.refresh(maybeUserId, dto.refresh_token);
  }

// 👇 reemplaza tu handler actual por este
@Get('auth/user/:id')
async getUserById(@Param('id') id: string) {
  return this.auth.getUserById(id);
}

}
