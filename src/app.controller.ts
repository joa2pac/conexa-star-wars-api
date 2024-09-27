import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Devuelve un mensaje de bienvenida a la API de Star Wars' })  
  @ApiResponse({
    status: 200,
    description: 'Devuelve un mensaje de bienvenida',
    schema: {
      type: 'string',
      example: 'Bienvenido a la API de Star Wars'
    }
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  getHello(): string {
    return 'Bienvenido a la API de Star Wars';
  }
}
