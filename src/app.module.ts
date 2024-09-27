/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DynamoDbService } from './services/dynamo-db/dynamo-db.service';
import { DynamoDbModule } from './modules/dynamo/dynamo.module';
import { MoviesService } from './services/movies/movies.service';
import { MoviesController } from './controllers/movies/movies.controller';
import { MoviesModule } from './modules/movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { StarWarsApiService } from './services/star-wars-api/star-wars-api.service';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './common/auth/guard/jwt-roles.guard';
import { JwtStrategy } from './common/auth/strategy/strategy';
import { JwtModule } from '@nestjs/jwt';
import { MovieDetailsModule } from './modules/movie-details/movie-details.module';
import { MovieDetailsController } from './controllers/movie-details/movie-details.controller';
import { MovieDetailsService } from './services/movie-details/movie-details.service';
import { CognitoModule } from './modules/cognito/cognito.module';
import { CognitoController } from './controllers/cognito/cognito.controller';
import { CognitoService } from './services/cognito/cognito.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DynamoDbModule.forRoot(),
    MoviesModule,
    HttpModule,
    AuthModule,
    JwtModule,
    MovieDetailsModule,
    CognitoModule
  ],
  controllers: [AppController, MoviesController, MovieDetailsController, CognitoController],
  providers: [DynamoDbService, StarWarsApiService, MoviesService, AuthService, RolesGuard, JwtStrategy, MovieDetailsService, CognitoService],
})
export class AppModule {}
