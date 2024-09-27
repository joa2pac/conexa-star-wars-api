/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';

export class Movie {
  @ApiProperty({
    description: 'UUID of the movie',
    example: 'f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12',
  })
  movieId: string;

  @ApiProperty({
    description: 'Title of the movie',
    example: 'Star Wars: A New Hope',
  })
  title: string;

  @ApiProperty({
    description: 'Created date of the movie',
    example: '2024-09-23T14:23:31.880Z',
  })
  created: string;

  @ApiProperty({
    description: 'Indicates if the movie is deleted',
    example: false,
    required: false,
  })
  deleted?: boolean;

  constructor(movieId: string, title: string, created: string, deleted?: boolean) {
    this.movieId = movieId;
    this.title = title;
    this.created = created;
    this.deleted = deleted;
  }
}
