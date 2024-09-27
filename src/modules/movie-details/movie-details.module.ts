/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { MovieDetailsService } from '@/services/movie-details/movie-details.service';
import { MovieDetailsController } from '@/controllers/movie-details/movie-details.controller';
import { DynamoDbModule } from '../dynamo/dynamo.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/common/auth/strategy/strategy';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';

@Module({
  imports: [DynamoDbModule.forRoot()],
  providers: [MovieDetailsService, JwtService, JwtStrategy, RolesGuard],
  controllers: [MovieDetailsController],
})
export class MovieDetailsModule {}
