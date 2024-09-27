import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

describe('AuthService', () => {
  let service: AuthService;
  let cognitoClientMock: ReturnType<typeof mockClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'COGNITO_REGION':
                  return 'us-east-1';
                case 'COGNITO_USER_POOL_ID':
                  return 'us-east-1_example';
                case 'COGNITO_CLIENT_ID':
                  return 'exampleclientid123';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    cognitoClientMock = mockClient(CognitoIdentityProviderClient);
  });

  afterEach(() => {
    cognitoClientMock.reset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate the user with correct parameters', async () => {
    const mockResponse = {
      AuthenticationResult: {
        AccessToken: 'access-token',
        IdToken: 'id-token',
        RefreshToken: 'refresh-token',
        ExpiresIn: 3600,
        TokenType: 'Bearer',
      },
    };

    cognitoClientMock.on(AdminInitiateAuthCommand).resolves(mockResponse);

    const username = 'testuser';
    const password = 'testpassword';

    const result = await service.authenticate(username, password);

    expect(result).toEqual(mockResponse.AuthenticationResult);

    expect(cognitoClientMock).toHaveReceivedCommandWith(AdminInitiateAuthCommand, {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: 'us-east-1_example',
      ClientId: 'exampleclientid123',
      AuthParameters: {
        USERNAME: 'testuser',
        PASSWORD: 'testpassword',
      },
    });
  });
});
