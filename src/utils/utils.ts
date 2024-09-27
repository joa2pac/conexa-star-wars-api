import { FilmApiResponse } from "@/interfaces/dtos/film.dto";
import { CreateMovieDto } from "@/interfaces/dtos/movie.dto";


export function mapApiResponseToMovieDocuments(response: FilmApiResponse): CreateMovieDto[] {
  return response.results.map(film => {
    return {
      movieId: film.episode_id.toString(),
      title: film.title,
      created: film.created
    };
  });
}