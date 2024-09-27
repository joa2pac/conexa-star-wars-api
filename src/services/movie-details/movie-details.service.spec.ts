import { Test, TestingModule } from '@nestjs/testing';
import { MovieDetailsService } from './movie-details.service';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { v4 as uuidv4 } from 'uuid';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';

jest.mock('uuid');

describe('MovieDetailsService', () => {
  let service: MovieDetailsService;
  let dynamoDbServiceMock: DynamoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieDetailsService,
        {
          provide: DynamoDbService,
          useValue: {
            getItem: jest.fn(),
            putItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            scanItems: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieDetailsService>(MovieDetailsService);
    dynamoDbServiceMock = module.get<DynamoDbService>(DynamoDbService);
    (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovieDetailById', () => {
    it('should return movie details by movieId', async () => {
      const mockMovieDetail = { movieId: '123', title: 'Test Movie' };
      const params = {
        TableName: 'movie_details',
        Key: { movieId: '123' },
      };

      (dynamoDbServiceMock.getItem as jest.Mock).mockResolvedValue(mockMovieDetail);

      const result = await service.getMovieDetailById('123');

      expect(result).toEqual(mockMovieDetail);
      expect(dynamoDbServiceMock.getItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.getItem fails', async () => {
      (dynamoDbServiceMock.getItem as jest.Mock).mockRejectedValue(new Error('Error fetching movie detail'));

      await expect(service.getMovieDetailById('123')).rejects.toThrow('Error fetching movie detail');
    });
  });

  describe('createMovieDetail', () => {
    it('should create a new movie detail', async () => {
      const mockMovieDetail = { title: 'Test Movie' };
      const params = {
        TableName: 'movie_details',
        Item: {
          movieDetailId: 'mock-uuid',
          ...mockMovieDetail,
        },
      };

      await service.createMovieDetail(mockMovieDetail);

      expect(dynamoDbServiceMock.putItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.putItem fails', async () => {
      (dynamoDbServiceMock.putItem as jest.Mock).mockRejectedValue(new Error('Error inserting movie detail'));

      await expect(service.createMovieDetail({ title: 'Test Movie' })).rejects.toThrow('Error inserting movie detail');
    });
  });

  describe('patchMovieDetail', () => {
    it('should update movie detail with partial fields', async () => {
      const updateFields: Partial<MovieDetail> = {
        synopsis: 'Updated synopsis',
        cast: ['Actor 1', 'Actor 2'],
        deleted: false,
      };

      const params = {
        TableName: 'movie_details',
        Key: { movieId: '123' },
        UpdateExpression: 'SET #synopsis = :synopsis, #cast = :cast, #deleted = :deleted',
        ExpressionAttributeNames: { '#synopsis': 'synopsis', '#cast': 'cast', '#deleted': 'deleted' },
        ExpressionAttributeValues: { ':synopsis': 'Updated synopsis', ':cast': ['Actor 1', 'Actor 2'], ':deleted': false },
        ReturnValues: 'UPDATED_NEW',
      };

      await service.patchMovieDetail('123', updateFields);

      expect(dynamoDbServiceMock.updateItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.updateItem fails', async () => {
      (dynamoDbServiceMock.updateItem as jest.Mock).mockRejectedValue(new Error('Error updating movie detail'));

      await expect(service.patchMovieDetail('123', { synopsis: 'Updated synopsis' })).rejects.toThrow('Error updating movie detail');
    });
  });

  describe('deleteMovieDetail', () => {
    it('should delete a movie detail by movieId', async () => {
      const params = {
        TableName: 'movie_details',
        Key: { movieId: '123' },
      };

      await service.deleteMovieDetail('123');

      expect(dynamoDbServiceMock.deleteItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.deleteItem fails', async () => {
      (dynamoDbServiceMock.deleteItem as jest.Mock).mockRejectedValue(new Error('Error deleting movie detail'));

      await expect(service.deleteMovieDetail('123')).rejects.toThrow('Error deleting movie detail');
    });
  });

  describe('getAllMoviesDetail', () => {
    it('should return all movie details', async () => {
      const mockMovieDetails = [{ movieId: '123', title: 'Test Movie' }, { movieId: '456', title: 'Another Movie' }];
      const params = { TableName: 'movie_details' };

      (dynamoDbServiceMock.scanItems as jest.Mock).mockResolvedValue(mockMovieDetails);

      const result = await service.getAllMoviesDetail();

      expect(result).toEqual(mockMovieDetails);
      expect(dynamoDbServiceMock.scanItems).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.scanItems fails', async () => {
      (dynamoDbServiceMock.scanItems as jest.Mock).mockRejectedValue(new Error('Error scanning movie details'));

      await expect(service.getAllMoviesDetail()).rejects.toThrow('Error scanning movie details');
    });
  });
});
