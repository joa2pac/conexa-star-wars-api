import { Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDbService {
  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocumentClient
  ) {}

  async getItem(params: any) {
    try {
      const data = await this.dynamoDbClient.send(new GetCommand(params));
      return data.Item;
    } catch (err) {
      console.error('Error fetching item:', err);
      throw err;
    }
  }

  async putItem(params: any) {
    try {
      await this.dynamoDbClient.send(new PutCommand(params));
    } catch (err) {
      console.error('Error inserting item:', err);
      throw err;
    }
  }

  async scanItems<T>(params: any): Promise<T> {
    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      return data.Items as T;
    } catch (err) {
      console.error('Error scanning items:', err);
      throw err;
    }
  }

  async updateItem(params: any) {
    try {
      await this.dynamoDbClient.send(new UpdateCommand(params));
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    }
  }

  async deleteItem(params: any) {
    try {
      await this.dynamoDbClient.send(new DeleteCommand(params));
    } catch (err) {
      console.error('Error deleting item:', err);
      throw err;
    }
  }
}
