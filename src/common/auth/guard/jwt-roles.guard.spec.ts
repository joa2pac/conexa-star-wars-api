import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './jwt-roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflectorMock: Reflector;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflectorMock = module.get<Reflector>(Reflector);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer mockToken',
          },
        }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
    };

    it('should allow access for users with the correct role', () => {
      const requiredRoles = ['admin'];
      jest.spyOn(reflectorMock, 'get').mockReturnValue(requiredRoles);

      const decodedToken = { 'cognito:groups': ['admin'] };
      jest.spyOn(jwtServiceMock, 'decode').mockReturnValue(decodedToken);

      const result = rolesGuard.canActivate(mockExecutionContext as ExecutionContext);
      expect(result).toBe(true);
    });

    it('should deny access if the user does not have the correct role', () => {
      const requiredRoles = ['admin'];
      jest.spyOn(reflectorMock, 'get').mockReturnValue(requiredRoles);

      const decodedToken = { 'cognito:groups': ['user'] };
      jest.spyOn(jwtServiceMock, 'decode').mockReturnValue(decodedToken);

      const result = rolesGuard.canActivate(mockExecutionContext as ExecutionContext);
      expect(result).toBe(false);
    });

    it('should allow access if no roles are required', () => {
      jest.spyOn(reflectorMock, 'get').mockReturnValue(null);

      const result = rolesGuard.canActivate(mockExecutionContext as ExecutionContext);
      expect(result).toBe(true);
    });
  });
});
