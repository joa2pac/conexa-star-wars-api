import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { Movie } from '@/interfaces/dynamo/movie';

describe('MoviesService', () => {
  let service: MoviesService;
  let dynamoDbServiceMock: DynamoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
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

    service = module.get<MoviesService>(MoviesService);
    dynamoDbServiceMock = module.get<DynamoDbService>(DynamoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const mockMovie = { movieId: '123', title: 'Test Movie' };
      const params = {
        TableName: 'movies',
        Key: { movieId: '123' },
      };

      (dynamoDbServiceMock.getItem as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.getMovieById('123');

      expect(result).toEqual(mockMovie);
      expect(dynamoDbServiceMock.getItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.getItem fails', async () => {
      (dynamoDbServiceMock.getItem as jest.Mock).mockRejectedValue(new Error('Error fetching movie'));

      await expect(service.getMovieById('123')).rejects.toThrow('Error fetching movie');
    });
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const mockMovie = { movieId: '123', title: 'Test Movie' };
      const params = {
        TableName: 'movies',
        Item: mockMovie,
      };

      await service.createMovie(mockMovie);

      expect(dynamoDbServiceMock.putItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.putItem fails', async () => {
      (dynamoDbServiceMock.putItem as jest.Mock).mockRejectedValue(new Error('Error inserting movie'));

      await expect(service.createMovie({ movieId: '123', title: 'Test Movie' })).rejects.toThrow('Error inserting movie');
    });
  });

  describe('patchMovie', () => {
    it('should update a movie with partial fields', async () => {
      const updateFields: Partial<Movie> = { title: 'Updated Title', deleted: false };
      const params = {
        TableName: 'movies',
        Key: { movieId: '123' },
        UpdateExpression: 'SET #title = :title, #deleted = :deleted',
        ExpressionAttributeNames: { '#title': 'title', '#deleted': 'deleted' },
        ExpressionAttributeValues: { ':title': 'Updated Title', ':deleted': false },
        ReturnValues: 'UPDATED_NEW',
      };

      await service.patchMovie('123', updateFields);

      expect(dynamoDbServiceMock.updateItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.updateItem fails', async () => {
      (dynamoDbServiceMock.updateItem as jest.Mock).mockRejectedValue(new Error('Error updating movie'));

      await expect(service.patchMovie('123', { title: 'Updated Title' })).rejects.toThrow('Error updating movie');
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie by ID', async () => {
      const params = {
        TableName: 'movies',
        Key: { movieId: '123' },
      };

      await service.deleteMovie('123');

      expect(dynamoDbServiceMock.deleteItem).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.deleteItem fails', async () => {
      (dynamoDbServiceMock.deleteItem as jest.Mock).mockRejectedValue(new Error('Error deleting movie'));

      await expect(service.deleteMovie('123')).rejects.toThrow('Error deleting movie');
    });
  });

  describe('getAllMovies', () => {
    it('should return all movies', async () => {
      const mockMovies = [{ movieId: '123', title: 'Test Movie' }, { movieId: '456', title: 'Another Movie' }];
      const params = { TableName: 'movies' };

      (dynamoDbServiceMock.scanItems as jest.Mock).mockResolvedValue(mockMovies);

      const result = await service.getAllMovies();

      expect(result).toEqual(mockMovies);
      expect(dynamoDbServiceMock.scanItems).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.scanItems fails', async () => {
      (dynamoDbServiceMock.scanItems as jest.Mock).mockRejectedValue(new Error('Error scanning movies'));

      await expect(service.getAllMovies()).rejects.toThrow('Error scanning movies');
    });
  });

  describe('getMovieDetailsByMovieId', () => {
    it('should return movie details by movie ID', async () => {
      const mockDetails = [{ movieId: '123', synopsis: 'Test synopsis' }];
      const params = {
        TableName: 'movie_details',
        FilterExpression: 'movieId = :movieId',
        ExpressionAttributeValues: { ':movieId': '123' },
      };

      (dynamoDbServiceMock.scanItems as jest.Mock).mockResolvedValue(mockDetails);

      const result = await service.getMovieDetailsByMovieId('123');

      expect(result).toEqual(mockDetails);
      expect(dynamoDbServiceMock.scanItems).toHaveBeenCalledWith(params);
    });

    it('should throw an error when DynamoDbService.scanItems fails', async () => {
      (dynamoDbServiceMock.scanItems as jest.Mock).mockRejectedValue(new Error('Error fetching movie details'));

      await expect(service.getMovieDetailsByMovieId('123')).rejects.toThrow('Error fetching movie details');
    });
  });
});