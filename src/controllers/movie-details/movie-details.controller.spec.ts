import { Test, TestingModule } from '@nestjs/testing';
import { MovieDetailsController } from './movie-details.controller';
import { MovieDetailsService } from '@/services/movie-details/movie-details.service';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';

describe('MovieDetailsController', () => {
  let controller: MovieDetailsController;
  let movieDetailsService: MovieDetailsService;

  const mockMovieDetailsService = {
    getMovieDetailById: jest.fn(),
    createMovieDetail: jest.fn(),
    patchMovieDetail: jest.fn(),
    deleteMovieDetail: jest.fn(),
    getAllMoviesDetail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieDetailsController],
      providers: [
        {
          provide: MovieDetailsService,
          useValue: mockMovieDetailsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        RolesGuard,
        JwtAuthGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<MovieDetailsController>(MovieDetailsController);
    movieDetailsService = module.get<MovieDetailsService>(MovieDetailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovieDetailsById', () => {
    it('should call MovieDetailsService.getMovieDetailById and return the result', async () => {
      const mockMovieDetail: MovieDetail = {
        movieId: '12345',
        synopsis: 'A great space movie.',
        cast: ['Actor 1', 'Actor 2'],
        duration: 121,
        genre: ['Science Fiction'],
        rating: 'PG',
        releaseDate: '1977-05-25',
        created: '2023-01-01',
      };

      mockMovieDetailsService.getMovieDetailById.mockResolvedValue(mockMovieDetail);

      const result = await controller.getMovieDetailsById('12345');

      expect(movieDetailsService.getMovieDetailById).toHaveBeenCalledWith('12345');
      expect(result).toEqual(mockMovieDetail);
    });
  });

  describe('createMovieDetails', () => {
    it('should call MovieDetailsService.createMovieDetail and return the result', async () => {
      const movieDetail: MovieDetail = {
        movieId: '12345',
        synopsis: 'A great space movie.',
        cast: ['Actor 1', 'Actor 2'],
        duration: 121,
        genre: ['Science Fiction'],
        rating: 'PG',
        releaseDate: '1977-05-25',
        created: '2023-01-01',
      };

      const mockResponse = { ...movieDetail };

      mockMovieDetailsService.createMovieDetail.mockResolvedValue(mockResponse);

      const result = await controller.createMovieDetails(movieDetail);

      expect(movieDetailsService.createMovieDetail).toHaveBeenCalledWith(movieDetail);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateMovieDetails', () => {
    it('should call MovieDetailsService.patchMovieDetail and return the result', async () => {
      const movieDetail: MovieDetail = {
        movieId: '12345',
        synopsis: 'A great space movie.',
        cast: ['Actor 1', 'Actor 2'],
        duration: 121,
        genre: ['Science Fiction'],
        rating: 'PG',
        releaseDate: '1977-05-25',
        created: '2023-01-01',
      };

      const mockResponse = { ...movieDetail };

      mockMovieDetailsService.patchMovieDetail.mockResolvedValue(mockResponse);

      const result = await controller.updateMovieDetails('12345', movieDetail);

      expect(movieDetailsService.patchMovieDetail).toHaveBeenCalledWith('12345', movieDetail);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('patchMovieDetails', () => {
    it('should call MovieDetailsService.patchMovieDetail with partial update and return the result', async () => {
      const partialUpdate = { synopsis: 'An updated synopsis' };

      const mockResponse = { movieId: '12345', ...partialUpdate };

      mockMovieDetailsService.patchMovieDetail.mockResolvedValue(mockResponse);

      const result = await controller.patchMovieDetails('12345', partialUpdate);

      expect(movieDetailsService.patchMovieDetail).toHaveBeenCalledWith('12345', partialUpdate);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteMovieDetails', () => {
    it('should call MovieDetailsService.deleteMovieDetail and return the result', async () => {
      const mockResponse = { status: 'Movie details deleted successfully' };

      mockMovieDetailsService.deleteMovieDetail.mockResolvedValue(mockResponse);

      const result = await controller.deleteMovieDetails('12345');

      expect(movieDetailsService.deleteMovieDetail).toHaveBeenCalledWith('12345');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllMovieDetails', () => {
    it('should call MovieDetailsService.getAllMoviesDetail and return the result', async () => {
      const mockMovieDetails = [
        {
          movieId: '12345',
          synopsis: 'A great space movie.',
          cast: ['Actor 1', 'Actor 2'],
          duration: 121,
          genre: ['Science Fiction'],
          rating: 'PG',
          releaseDate: '1977-05-25',
          created: '2023-01-01',
        },
      ];

      mockMovieDetailsService.getAllMoviesDetail.mockResolvedValue(mockMovieDetails);

      const result = await controller.getAllMovieDetails();

      expect(movieDetailsService.getAllMoviesDetail).toHaveBeenCalled();
      expect(result).toEqual(mockMovieDetails);
    });
  });
});
