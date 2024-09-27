import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { Movie } from '@/interfaces/dynamo/movie';

@Injectable()
export class MoviesService {
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  async getMovieById(movieId: string) {
    const params = {
      TableName: 'movies',
      Key: {
        movieId: movieId,
      },
    };
    return this.dynamoDbService.getItem(params);
  }

  async createMovie(movie: any) {
    const params = {
      TableName: 'movies',
      Item: movie,
    };
    return this.dynamoDbService.putItem(params);
  }

  async patchMovie(movieId: string, updateFields: Partial<Movie>) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (updateFields.title) {
      updateExpression.push('#title = :title');
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = updateFields.title;
    }

    if (typeof updateFields.deleted !== 'undefined') {
      updateExpression.push('#deleted = :deleted');
      expressionAttributeNames['#deleted'] = 'deleted';
      expressionAttributeValues[':deleted'] = updateFields.deleted;
    }

    const params = {
      TableName: 'movies',
      Key: {
        movieId: movieId,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
    };
    return this.dynamoDbService.updateItem(params);
  }

  async deleteMovie(movieId: string) {
    const params = {
      TableName: 'movies',
      Key: {
        movieId: movieId,
      },
    };
    return this.dynamoDbService.deleteItem(params);
  }

  async getAllMovies(): Promise<Movie[]> {
    const params = {
      TableName: 'movies',
    };
    return this.dynamoDbService.scanItems(params);
  }

  async getMovieDetailsByMovieId(movieId: string) {
    const params = {
      TableName: 'movie_details',
      FilterExpression: 'movieId = :movieId',
      ExpressionAttributeValues: { ':movieId': movieId },
    };
    return this.dynamoDbService.scanItems(params);
  }
  
}
