import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from '@/services/movies/movies.service';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { Movie } from '@/interfaces/dynamo/movie';
import { Reflector } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { StarWarsApiService } from '@/services/star-wars-api/star-wars-api.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;
  let starWarsApiService: StarWarsApiService;

  const mockMovie: Movie = new Movie(
    'f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12',
    'Star Wars: A New Hope',
    '2024-09-23T14:23:31.880Z',
    false,
  );

  const mockMoviesService = {
    getMovieById: jest.fn().mockResolvedValue(mockMovie),
    createMovie: jest.fn().mockResolvedValue(mockMovie),
    patchMovie: jest.fn().mockResolvedValue(mockMovie),
    deleteMovie: jest.fn().mockResolvedValue({ success: true }),
    getAllMovies: jest.fn().mockResolvedValue([mockMovie]),
    getMovieDetailsByMovieId: jest.fn().mockResolvedValue({
      movieId: '12345',
      synopsis: 'A long time ago in a galaxy far, far away...',
      cast: ['Mark Hamill', 'Harrison Ford'],
      duration: 120,
      genre: ['Sci-Fi', 'Action'],
      rating: 'PG',
      releaseDate: '1977-05-25',
      created: '2024-09-23',
    }),
  };

  const mockStarWarsApiService = {
    syncAllMovies: jest.fn().mockResolvedValue({
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
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: StarWarsApiService,
          useValue: mockStarWarsApiService,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
    starWarsApiService = module.get<StarWarsApiService>(StarWarsApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovieById', () => {
    it('should call MoviesService.getMovieById and return the result', async () => {
      const result = await controller.getMovieById('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12');
      expect(service.getMovieById).toHaveBeenCalledWith('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12');
      expect(result).toEqual(mockMovie);
    });
  });

  describe('createMovie', () => {
    it('should call MoviesService.createMovie and return the result', async () => {
      const newMovie: Movie = new Movie(uuidv4(), 'Star Wars: The Empire Strikes Back', new Date().toISOString());
      const result = await controller.createMovie(newMovie);
      expect(service.createMovie).toHaveBeenCalledWith(expect.objectContaining({
        movieId: 'mocked-uuid',
        title: 'Star Wars: The Empire Strikes Back',
      }));
      expect(result).toEqual(mockMovie);
    });
  });

  describe('updateMovie', () => {
    it('should call MoviesService.patchMovie and return the result', async () => {
      const updatedMovie: Movie = new Movie(
        'f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12',
        'Star Wars: A New Hope - Updated',
        '2024-09-23T14:23:31.880Z',
      );
      const result = await controller.updateMovie(updatedMovie.movieId, updatedMovie);
      expect(service.patchMovie).toHaveBeenCalledWith(updatedMovie.movieId, updatedMovie);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('patchMovie', () => {
    it('should call MoviesService.patchMovie with partial update and return the result', async () => {
      const partialUpdate = { title: 'Star Wars: The Empire Strikes Back - Updated' };
      const result = await controller.patchMovie('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12', partialUpdate);
      expect(service.patchMovie).toHaveBeenCalledWith('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12', partialUpdate);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('deleteMovie', () => {
    it('should call MoviesService.deleteMovie and return the result', async () => {
      const result = await controller.deleteMovie('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12');
      expect(service.deleteMovie).toHaveBeenCalledWith('f25c9e8d-7b8a-4e6d-8e7d-c88db8284d12');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getAllMovies', () => {
    it('should call MoviesService.getAllMovies and return the result', async () => {
      const result = await controller.getAllMovies();
      expect(service.getAllMovies).toHaveBeenCalled();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('syncAllMovies', () => {
    it('should call StarWarsApiService.syncAllMovies and return the result', async () => {
      const result = await controller.syncAllMovies();
      expect(starWarsApiService.syncAllMovies).toHaveBeenCalled();
      expect(result).toEqual({
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
      });
    });
  });

  describe('getMovieDetailsByMovieId', () => {
    it('should call MoviesService.getMovieDetailsByMovieId and return the result', async () => {
      const result = await controller.getMovieDetailsByMovieId('12345');
      expect(service.getMovieDetailsByMovieId).toHaveBeenCalledWith('12345');
      expect(result).toEqual({
        movieId: '12345',
        synopsis: 'A long time ago in a galaxy far, far away...',
        cast: ['Mark Hamill', 'Harrison Ford'],
        duration: 120,
        genre: ['Sci-Fi', 'Action'],
        rating: 'PG',
        releaseDate: '1977-05-25',
        created: '2024-09-23',
      });
    });
  });
});
