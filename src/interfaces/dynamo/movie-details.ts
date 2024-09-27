/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';

export class MovieDetail {
  @ApiProperty({
    description: 'UUID of the associated movie',
    example: 'f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12',
  })
  movieId: string;

  @ApiProperty({
    description: 'Synopsis of the movie',
    example: 'A young farmer, Luke Skywalker, embarks on a journey to save the galaxy.',
  })
  synopsis: string;

  @ApiProperty({
    description: 'List of cast members in the movie',
    example: ['Mark Hamill', 'Carrie Fisher', 'Harrison Ford'],
  })
  cast: string[];

  @ApiProperty({
    description: 'Duration of the movie in minutes',
    example: 120,
  })
  duration: number;

  @ApiProperty({
    description: 'Genres the movie belongs to',
    example: ['Action', 'Adventure', 'Sci-Fi'],
  })
  genre: string[];

  @ApiProperty({
    description: 'Rating of the movie',
    example: 'PG-13',
  })
  rating: string;

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1977-05-25',
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Creation timestamp for the movie detail record',
    example: '2024-09-23T14:23:31.880Z',
  })
  created: string;

  @ApiProperty({
    description: 'Indicates if the movie detail is deleted',
    example: false,
    required: false,
  })
  deleted?: boolean;

  constructor(
    movieId: string,
    synopsis: string,
    cast: string[],
    duration: number,
    genre: string[],
    rating: string,
    releaseDate: string,
    created: string,
    deleted?: boolean
  ) {
    this.movieId = movieId;
    this.synopsis = synopsis;
    this.cast = cast;
    this.duration = duration;
    this.genre = genre;
    this.rating = rating;
    this.releaseDate = releaseDate;
    this.created = created;
    this.deleted = deleted;
  }
}
