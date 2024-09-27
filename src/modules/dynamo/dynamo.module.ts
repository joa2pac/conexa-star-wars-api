/* istanbul ignore file */
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from '@/services/dynamo-db/dynamo-db.service';

@Module({})
export class DynamoDbModule {
  static forRoot(): DynamicModule {
    const dynamoDbClientProvider = {
      provide: 'DYNAMODB_CLIENT',
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('AWS_REGION');
        const endpoint = configService.get<string>('AWS_DYNAMODB_ENDPOINT');
        const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');

        const client = new DynamoDBClient({
          region,
          endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        return DynamoDBDocumentClient.from(client);
      },
      inject: [ConfigService],
    };

    return {
      module: DynamoDbModule,
      imports: [ConfigModule],
      providers: [dynamoDbClientProvider, DynamoDbService],
      exports: [dynamoDbClientProvider, DynamoDbService],
    };
  }
}
