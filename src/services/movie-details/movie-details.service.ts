import { Injectable } from '@nestjs/common';
import { DynamoDbService } from '../dynamo-db/dynamo-db.service';
import { MovieDetail } from '@/interfaces/dynamo/movie-details';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MovieDetailsService {
  constructor(private readonly dynamoDbService: DynamoDbService) {}

  async getMovieDetailById(movieId: string) {
    const params = {
      TableName: 'movie_details',
      Key: {
        movieId: movieId,
      },
    };
    return this.dynamoDbService.getItem(params);
  }

  async createMovieDetail(movieDetail: any) {
    const movieDetailId = uuidv4();
    const params = {
      TableName: 'movie_details',
      Item: {
        movieDetailId: movieDetailId,
        ...movieDetail,
      }
    };
    return this.dynamoDbService.putItem(params);
  }

  async patchMovieDetail(movieId: string, updateFields: Partial<MovieDetail>) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (updateFields.synopsis) {
      updateExpression.push('#synopsis = :synopsis');
      expressionAttributeNames['#synopsis'] = 'synopsis';
      expressionAttributeValues[':synopsis'] = updateFields.synopsis;
    }

    if (updateFields.cast) {
      updateExpression.push('#cast = :cast');
      expressionAttributeNames['#cast'] = 'cast';
      expressionAttributeValues[':cast'] = updateFields.cast;
    }

    if (typeof updateFields.deleted !== 'undefined') {
      updateExpression.push('#deleted = :deleted');
      expressionAttributeNames['#deleted'] = 'deleted';
      expressionAttributeValues[':deleted'] = updateFields.deleted;
    }

    const params = {
      TableName: 'movie_details',
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

  async deleteMovieDetail(movieId: string) {
    const params = {
      TableName: 'movie_details',
      Key: {
        movieId: movieId,
      },
    };
    return this.dynamoDbService.deleteItem(params);
  }

  async getAllMoviesDetail(): Promise<MovieDetail[]> {
    const params = {
      TableName: 'movie_details',
    };
    return this.dynamoDbService.scanItems(params);
  }
}
