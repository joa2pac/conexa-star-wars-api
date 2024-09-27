import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { StarWarsApiService } from './star-wars-api.service';
import { MoviesService } from '../movies/movies.service';
import { MovieDetailsService } from '../movie-details/movie-details.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { CreateMovieDto } from '@/interfaces/dtos/movie.dto';
import { mapApiResponseToMovieDocuments } from '@/utils/utils';
import { Movie } from '@/interfaces/dynamo/movie';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

jest.mock('@/utils/utils', () => ({
  mapApiResponseToMovieDocuments: jest.fn(),
}));

describe('StarWarsApiService', () => {
  let service: StarWarsApiService;
  let httpServiceMock: HttpService;
  let movieServiceMock: MoviesService;
  let movieDetailsServiceMock: MovieDetailsService;

  const swapiUrl = 'https://swapi.dev/api/films/';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarsApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: MoviesService,
          useValue: {
            getAllMovies: jest.fn(),
            createMovie: jest.fn(),
          },
        },
        {
          provide: MovieDetailsService,
          useValue: {
            createMovieDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StarWarsApiService>(StarWarsApiService);
    httpServiceMock = module.get<HttpService>(HttpService);
    movieServiceMock = module.get<MoviesService>(MoviesService);
    movieDetailsServiceMock = module.get<MovieDetailsService>(MovieDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilms', () => {
    it('should fetch films from Star Wars API and map them to movie documents', async () => {
      const mockApiResponse: AxiosResponse = {
        data: {
          results: [{ title: 'A New Hope' }],
        },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      jest.spyOn(httpServiceMock, 'get').mockReturnValue(of(mockApiResponse));

      const mockMovies: CreateMovieDto[] = [{ title: 'A New Hope', movieId: '1' }];
      (mapApiResponseToMovieDocuments as jest.Mock).mockReturnValue(mockMovies);

      const result = await service.getFilms();

      expect(httpServiceMock.get).toHaveBeenCalledWith(swapiUrl);
      expect(result).toEqual(mockMovies);
    });
  });

  describe('getFilm', () => {
    it('should fetch a specific film from Star Wars API by ID', async () => {
      const mockFilm = { title: 'A New Hope' };
      const mockFilmApiResponse: AxiosResponse = {
        data: mockFilm,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      jest.spyOn(httpServiceMock, 'get').mockReturnValue(of(mockFilmApiResponse));

      const result = await service.getFilm('1');

      expect(httpServiceMock.get).toHaveBeenCalledWith(`${swapiUrl}/1`);
      expect(result).toEqual(mockFilm);
    });

    it('should return undefined if the film is not found', async () => {
      jest.spyOn(httpServiceMock, 'get').mockReturnValue(throwError(() => new Error('Not found')));

      const result = await service.getFilm('1');

      expect(result).toBeUndefined();
    });
  });

  describe('syncAllMovies', () => {
    it('should sync movies and details from Star Wars API to the local database', async () => {
      const firestoreMovies: Movie[] = [{ movieId: '1', title: 'Existing Movie', created: '2024-09-23' }];
      const swapiMovies: CreateMovieDto[] = [
        { title: 'New Movie', movieId: '2', created: '2024-09-24', synopsis: 'Synopsis', cast: ['Actor'], duration: 120, genre: ['Sci-Fi'], rating: 'PG', releaseDate: '1977-05-25' },
      ];

      jest.spyOn(movieServiceMock, 'getAllMovies').mockResolvedValue(firestoreMovies);
      jest.spyOn(service, 'getFilms').mockResolvedValue(swapiMovies);

      const result = await service.syncAllMovies();

      const expectedMovie = new Movie('2', 'New Movie', '2024-09-24');
      const expectedMovieDetail = new MovieDetail(
        'test-uuid', 'Synopsis', ['Actor'], 120, ['Sci-Fi'], 'PG', '1977-05-25', '2024-09-24', false,
      );

      expect(movieServiceMock.getAllMovies).toHaveBeenCalled();
      expect(movieServiceMock.createMovie).toHaveBeenCalledWith({ ...expectedMovie, movieId: 'test-uuid' });
      expect(movieDetailsServiceMock.createMovieDetail).toHaveBeenCalledWith(expectedMovieDetail);
      expect(result).toEqual({
        addedMovies: {
          'New Movie': { movie: expectedMovie, details: expectedMovieDetail },
        },
      });
    });

    it('should not create a movie if it already exists in the database', async () => {
      const firestoreMovies: Movie[] = [{ movieId: '1', title: 'Existing Movie', created: '2024-09-23' }];
      const swapiMovies: CreateMovieDto[] = [
        { title: 'Existing Movie', movieId: '2', created: '2024-09-24' },
      ];

      jest.spyOn(movieServiceMock, 'getAllMovies').mockResolvedValue(firestoreMovies);
      jest.spyOn(service, 'getFilms').mockResolvedValue(swapiMovies);

      const result = await service.syncAllMovies();

      expect(movieServiceMock.createMovie).not.toHaveBeenCalled();
      expect(movieDetailsServiceMock.createMovieDetail).not.toHaveBeenCalled();
      expect(result).toEqual({ addedMovies: {} });
    });
  });
});
