import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateMovieDto } from '@/interfaces/dtos/movie.dto';
import { MoviesService } from '../movies/movies.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { Film, FilmApiResponse } from '@/interfaces/dtos/film.dto';
import { mapApiResponseToMovieDocuments } from '@/utils/utils';
import { Movie } from '@/interfaces/dynamo/movie';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StarWarsApiService {
  private readonly swapiUrl = 'https://swapi.dev/api/films/';

  constructor(
    private readonly httpService: HttpService,
    private readonly movieService: MoviesService,
    private readonly movieDetailsService: MovieDetailsService,
  ) {}

  async getFilms(): Promise<CreateMovieDto[]> {
    const response = await firstValueFrom(
      this.httpService.get<FilmApiResponse>(this.swapiUrl),
    );
    return mapApiResponseToMovieDocuments(response.data);
  }

  async getFilm(id: string): Promise<Film | undefined> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Film>(`${this.swapiUrl}/${id}`),
      );
      return response.data;
    } catch {
      return undefined;
    }
  }

  /**
   * Synchronizes movies and their details from the Star Wars API with the local database.
   * For each movie returned by the API, it checks if the movie and its details exist in the database.
   * If the movie does not exist, it creates the movie and its details in the database and returns the newly created movies.
   *
   * @returns {Promise<object>} An object containing the titles of the newly added movies and details.
   */
  async syncAllMovies(): Promise<{
    addedMovies: Record<string, { movie: Movie; details: MovieDetail }>;
  }> {
    const firestoreMovies = await this.movieService.getAllMovies();
    const swapiMovies = await this.getFilms();

    const addedMovies: Record<string, { movie: Movie; details: MovieDetail }> =
      {};

    for (const swapiMovie of swapiMovies) {
      const existingMovie = firestoreMovies.find(
        (movie) => movie.title === swapiMovie.title,
      );

      if (!existingMovie) {
        const newMovie = new Movie(
          swapiMovie.movieId,
          swapiMovie.title,
          swapiMovie.created,
        );
        const movieId = uuidv4();
        await this.movieService.createMovie({ ...newMovie, movieId });

        const newMovieDetails = new MovieDetail(
          movieId,
          swapiMovie.synopsis || 'No synopsis available',
          swapiMovie.cast || ['Unknown'],
          swapiMovie.duration || 120,
          swapiMovie.genre || ['Unknown'],
          swapiMovie.rating || 'NR',
          swapiMovie.releaseDate,
          swapiMovie.created,
          false,
        );
        await this.movieDetailsService.createMovieDetail(newMovieDetails);

        addedMovies[newMovie.title] = {
          movie: newMovie,
          details: newMovieDetails,
        };
      }
    }

    return { addedMovies };
  }
}
