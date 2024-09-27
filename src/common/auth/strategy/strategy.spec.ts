import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let jwtService: JwtService;

  const mockJwtPayload = {
    sub: 'user123',
    username: 'testuser',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'testSecret';
              }
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue(mockJwtPayload),
          },
        },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should validate and return the payload', async () => {
    const result = await jwtStrategy.validate(mockJwtPayload);

    expect(result).toEqual({
      userId: mockJwtPayload.sub,
      username: mockJwtPayload.username,
    });
  });

it('should throw UnauthorizedException for invalid token', async () => {
  jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error('Invalid token'));

  try {
    await jwtStrategy.validate(mockJwtPayload);
  } catch (error) {
    expect(error).toBeInstanceOf(UnauthorizedException);
  }
});

  it('should get JWT secret from config service', async () => {
    const secret = configService.get('JWT_SECRET');
    expect(secret).toEqual('testSecret');
  });
});
