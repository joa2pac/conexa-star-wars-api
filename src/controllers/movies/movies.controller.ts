import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '@/common/auth/decorators/guard';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { CreateMovieDto } from '@/interfaces/dtos/movie.dto';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { MoviesService } from '@/services/movies/movies.service';
import { StarWarsApiService } from '@/services/star-wars-api/star-wars-api.service';
import { Movie } from '@/interfaces/dynamo/movie';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('movies')
@ApiOAuth2(['openid'])
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly starWarsApiService: StarWarsApiService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'users')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una película por su ID' })
  @ApiParam({
    name: 'id',
    description: 'El ID único de la película',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Película devuelta exitosamente.',
    schema: {
      example: {
        movieId: '12345',
        title: 'Star Wars: A New Hope',
        releaseDate: '1977-05-25',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Película no encontrada.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva película' })
  @ApiResponse({
    status: 201,
    description: 'Película creada exitosamente.',
    schema: {
      example: {
        movieId: '12345',
        title: 'Star Wars: A New Hope',
        releaseDate: '1977-05-25',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async createMovie(@Body() movie: Movie) {
    const movieId = uuidv4();
    return this.moviesService.createMovie({ ...movie, movieId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una película' })
  @ApiParam({ name: 'id', description: 'El ID de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Película actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Película no encontrada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async updateMovie(@Param('id') id: string, @Body() movie: Movie) {
    return this.moviesService.patchMovie(id, movie);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente una película' })
  @ApiParam({ name: 'id', description: 'El ID de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Película actualizada parcialmente exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Película no encontrada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async patchMovie(
    @Param('id') id: string,
    @Body() partialUpdate: Partial<CreateMovieDto>,
  ) {
    return this.moviesService.patchMovie(id, partialUpdate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una película' })
  @ApiParam({ name: 'id', description: 'El ID de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Película eliminada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Película no encontrada.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'users')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las películas' })
  @ApiResponse({
    status: 200,
    description: 'Películas devueltas exitosamente.',
    schema: {
      example: [
        {
          movieId: '4',
          title: 'A New Hope',
          created: '2014-12-10T14:23:31.880000Z',
        },
        {
          movieId: '5',
          title: 'The Empire Strikes Back',
          created: '2014-12-12T11:26:24.656000Z',
        },
        {
          movieId: '6',
          title: 'Return of the Jedi',
          created: '2014-12-18T10:39:33.255000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('sync')
  @ApiOperation({
    summary:
      'Sincronizar películas de Star Wars API con el almacenamiento local',
  })
  @ApiResponse({
    status: 200,
    description: 'Películas sincronizadas exitosamente.',
    schema: {
      example: {
        addedMovies: {
          'Star Wars: A New Hope': {
            movieId: '12345',
            title: 'Star Wars: A New Hope',
            created: '1977-05-25',
          },
          'The Empire Strikes Back': {
            movieId: '12346',
            title: 'The Empire Strikes Back',
            created: '1980-05-17',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async syncAllMovies() {
    return this.starWarsApiService.syncAllMovies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'users')
  @Get(':id/details')
  @ApiOperation({ summary: 'Obtener detalles de una película por su ID' })
  @ApiParam({
    name: 'id',
    description: 'El ID único de la película',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la película devueltos exitosamente.',
    schema: {
      example: {
        movieId: '12345',
        synopsis: 'A long time ago in a galaxy far, far away...',
        cast: ['Mark Hamill', 'Harrison Ford'],
        duration: 120,
        genre: ['Sci-Fi', 'Action'],
        rating: 'PG',
        releaseDate: '1977-05-25',
        created: '2024-09-23',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Detalles de la película no encontrados.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async getMovieDetailsByMovieId(@Param('id') movieId: string) {
    return this.moviesService.getMovieDetailsByMovieId(movieId);
  }
}
