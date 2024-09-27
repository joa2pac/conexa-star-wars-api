import { Controller, Get, Param, Post, Body, UseGuards, Put, Patch, Delete } from '@nestjs/common';
import { ApiOAuth2, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Roles } from '@/common/auth/decorators/guard';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';
import { MovieDetailsService } from '@/services/movie-details/movie-details.service';

@ApiTags('movie-details')
@ApiOAuth2(['openid'])
@Controller('movie-details')
export class MovieDetailsController {
  constructor(private readonly movieDetailsService: MovieDetailsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'users')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener los detalles de una película por su ID' })
  @ApiParam({ name: 'id', description: 'El ID único de los detalles de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la película devueltos exitosamente.',
    schema: {
      example: {
        movieId: '12345',
        description: 'A great space movie about the battle between good and evil.',
        releaseDate: '1977-05-25',
        genre: 'Science Fiction',
        duration: '121 mins'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Detalles de la película no encontrados.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async getMovieDetailsById(@Param('id') id: string) {
    return this.movieDetailsService.getMovieDetailById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear nuevos detalles de una película' })
  @ApiResponse({
    status: 201,
    description: 'Detalles de la película creados exitosamente.',
    schema: {
      example: {
        movieId: '12345',
        description: 'A great space movie about the battle between good and evil.',
        releaseDate: '1977-05-25',
        genre: 'Science Fiction',
        duration: '121 mins'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async createMovieDetails(@Body() movieDetail: MovieDetail) {
    return this.movieDetailsService.createMovieDetail(movieDetail);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar los detalles de una película' })
  @ApiParam({ name: 'id', description: 'El ID de los detalles de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la película actualizados exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Detalles de la película no encontrados.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async updateMovieDetails(@Param('id') id: string, @Body() movieDetail: MovieDetail) {
    return this.movieDetailsService.patchMovieDetail(id, movieDetail);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente los detalles de una película' })
  @ApiParam({ name: 'id', description: 'El ID de los detalles de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la película actualizados parcialmente exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Detalles de la película no encontrados.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada no válidos.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async patchMovieDetails(@Param('id') id: string, @Body() partialUpdate: Partial<MovieDetail>) {
    return this.movieDetailsService.patchMovieDetail(id, partialUpdate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar los detalles de una película' })
  @ApiParam({ name: 'id', description: 'El ID de los detalles de la película', type: String })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la película eliminados exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Detalles de la película no encontrados.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async deleteMovieDetails(@Param('id') id: string) {
    return this.movieDetailsService.deleteMovieDetail(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'users')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los detalles de las películas' })
  @ApiResponse({
    status: 200,
    description: 'Detalles de las películas devueltos exitosamente.',
    schema: {
      example: [
        {
          movieId: '12345',
          description: 'A great space movie about the battle between good and evil.',
          releaseDate: '1977-05-25',
          genre: 'Science Fiction',
          duration: '121 mins'
        },
        {
          movieId: '54321',
          description: 'An adventurous story of a lost kingdom.',
          releaseDate: '2001-12-19',
          genre: 'Fantasy',
          duration: '180 mins'
        }
      ]
    }
  })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getAllMovieDetails() {
    return this.movieDetailsService.getAllMoviesDetail();
  }
}
