/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { JwtStrategy } from '@/common/auth/strategy/strategy';
import { CognitoController } from '@/controllers/cognito/cognito.controller';
import { CognitoService } from '@/services/cognito/cognito.service';

@Module({
  imports: [ConfigModule],
  providers: [CognitoService, JwtService, JwtStrategy, RolesGuard],
  controllers: [CognitoController],
})
export class CognitoModule {}
