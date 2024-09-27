/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { DynamoDbModule } from '../dynamo/dynamo.module';
import { MoviesService } from '@/services/movies/movies.service';
import { MoviesController } from '@/controllers/movies/movies.controller';
import { StarWarsApiService } from '@/services/star-wars-api/star-wars-api.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/common/auth/strategy/strategy';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { MovieDetailsService } from '@/services/movie-details/movie-details.service';

@Module({
  imports: [DynamoDbModule.forRoot(), HttpModule],
  providers: [
    StarWarsApiService,
    MoviesService,
    MovieDetailsService,
    JwtService,
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [MoviesController],
})
export class MoviesModule {}
