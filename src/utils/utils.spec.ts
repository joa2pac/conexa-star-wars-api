import { mapApiResponseToMovieDocuments } from "./utils";
import { FilmApiResponse } from "@/interfaces/dtos/film.dto";
import { CreateMovieDto } from "@/interfaces/dtos/movie.dto";

describe('mapApiResponseToMovieDocuments', () => {
  it('should correctly map FilmApiResponse to CreateMovieDto[]', () => {
    const mockApiResponse: FilmApiResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          episode_id: 1,
          title: 'A New Hope',
          opening_crawl: '...',
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          release_date: '1977-05-25',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: '1977-05-25T00:00:00.000Z',
          edited: '1977-05-25T00:00:00.000Z',
          url: 'https://swapi.dev/api/films/1/'
        },
        {
          episode_id: 2,
          title: 'The Empire Strikes Back',
          opening_crawl: '...',
          director: 'Irvin Kershner',
          producer: 'Gary Kurtz, George Lucas',
          release_date: '1980-05-21',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          created: '1980-05-21T00:00:00.000Z',
          edited: '1980-05-21T00:00:00.000Z',
          url: 'https://swapi.dev/api/films/2/'
        }
      ]
    };

    const expected: CreateMovieDto[] = [
      {
        movieId: '1',
        title: 'A New Hope',
        created: '1977-05-25T00:00:00.000Z'
      },
      {
        movieId: '2',
        title: 'The Empire Strikes Back',
        created: '1980-05-21T00:00:00.000Z'
      }
    ];

    const result = mapApiResponseToMovieDocuments(mockApiResponse);

    expect(result).toEqual(expected);
  });

  it('should return an empty array when response has no results', () => {
    const mockApiResponse: FilmApiResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    const result = mapApiResponseToMovieDocuments(mockApiResponse);

    expect(result).toEqual([]);
  });
});
