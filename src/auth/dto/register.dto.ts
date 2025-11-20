import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  // ✅ Campo adicional para el rol (USER o DRIVER)
  @IsOptional()
  @IsString()
  role?: string;
}
