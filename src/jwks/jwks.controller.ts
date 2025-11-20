import { Controller, Get } from '@nestjs/common';
import { JwksService } from './jwks.service';

@Controller('.well-known')
export class JwksController {
  constructor(private readonly jwks: JwksService) {}

  @Get('jwks.json')
  get() {
    return this.jwks.getJwks();
  }
}
