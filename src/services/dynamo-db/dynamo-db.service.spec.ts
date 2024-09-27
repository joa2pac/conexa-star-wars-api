import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDbService } from './dynamo-db.service';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

describe('DynamoDbService', () => {
  let service: DynamoDbService;
  let dynamoDbClientMock: jest.Mocked<DynamoDBDocumentClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamoDbService,
        {
          provide: 'DYNAMODB_CLIENT',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DynamoDbService>(DynamoDbService);
    dynamoDbClientMock = module.get('DYNAMODB_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getItem', () => {
    it('should return the item', async () => {
      const mockResponse = { Item: { id: '123', name: 'Test Item' } };
      (dynamoDbClientMock.send as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params = { TableName: 'TestTable', Key: { id: '123' } };
      const result = await service.getItem(params);

      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(result).toEqual(mockResponse.Item);
    });

    it('should throw an error when fetching item fails', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

      const params = { TableName: 'TestTable', Key: { id: '123' } };

      await expect(service.getItem(params)).rejects.toThrow('Failed to fetch');
    });
  });

  describe('putItem', () => {
    it('should insert an item', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockResolvedValueOnce({});

      const params = { TableName: 'TestTable', Item: { id: '123', name: 'Test Item' } };
      await service.putItem(params);

      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw an error when inserting item fails', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockRejectedValueOnce(new Error('Failed to insert'));

      const params = { TableName: 'TestTable', Item: { id: '123', name: 'Test Item' } };

      await expect(service.putItem(params)).rejects.toThrow('Failed to insert');
    });
  });

  describe('scanItems', () => {
    it('should return items', async () => {
      const mockResponse = { Items: [{ id: '123', name: 'Test Item' }] };
      (dynamoDbClientMock.send as jest.Mock).mockResolvedValueOnce(mockResponse);

      const params = { TableName: 'TestTable' };
      const result = await service.scanItems(params);

      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(expect.any(ScanCommand));
      expect(result).toEqual(mockResponse.Items);
    });

    it('should throw an error when scanning items fails', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockRejectedValueOnce(new Error('Failed to scan'));

      const params = { TableName: 'TestTable' };

      await expect(service.scanItems(params)).rejects.toThrow('Failed to scan');
    });
  });

  describe('updateItem', () => {
    it('should update an item', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockResolvedValueOnce({});

      const params = {
        TableName: 'TestTable',
        Key: { id: '123' },
        UpdateExpression: 'set name = :name',
        ExpressionAttributeValues: { ':name': 'Updated Item' },
      };
      await service.updateItem(params);

      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    it('should throw an error when updating item fails', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockRejectedValueOnce(new Error('Failed to update'));

      const params = {
        TableName: 'TestTable',
        Key: { id: '123' },
        UpdateExpression: 'set name = :name',
        ExpressionAttributeValues: { ':name': 'Updated Item' },
      };

      await expect(service.updateItem(params)).rejects.toThrow('Failed to update');
    });
  });

  describe('deleteItem', () => {
    it('should delete an item', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockResolvedValueOnce({});

      const params = { TableName: 'TestTable', Key: { id: '123' } };
      await service.deleteItem(params);

      expect(dynamoDbClientMock.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    it('should throw an error when deleting item fails', async () => {
      (dynamoDbClientMock.send as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete'));

      const params = { TableName: 'TestTable', Key: { id: '123' } };

      await expect(service.deleteItem(params)).rejects.toThrow('Failed to delete');
    });
  });
});
