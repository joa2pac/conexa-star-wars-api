/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@/services/auth/auth.service';
import { JwtStrategy } from '@/common/auth/strategy/strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
