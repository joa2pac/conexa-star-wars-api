import { Test, TestingModule } from '@nestjs/testing';
import { CognitoController } from './cognito.controller';
import { CognitoService } from '@/services/cognito/cognito.service';
import { CreateUserDto } from '@/interfaces/dtos/create-user.dto';
import { SetPasswordDto } from '@/interfaces/dtos/set-password.dto';
import { AddUserToGroupDto } from '@/interfaces/dtos/add-user-to-group.dto';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('CognitoController', () => {
  let controller: CognitoController;
  let cognitoService: CognitoService;

  const mockCognitoService = {
    listUsers: jest.fn(),
    createUser: jest.fn(),
    setUserPassword: jest.fn(),
    addUserToGroup: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CognitoController],
      providers: [
        {
          provide: CognitoService,
          useValue: mockCognitoService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        RolesGuard,
        JwtAuthGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<CognitoController>(CognitoController);
    cognitoService = module.get<CognitoService>(CognitoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listUsers', () => {
    it('should call CognitoService.listUsers and return the result', async () => {
      const mockUsers = [
        {
          Username: 'testuser1',
          UserAttributes: [{ Name: 'email', Value: 'testuser1@example.com' }],
        },
      ];
      mockCognitoService.listUsers.mockResolvedValue(mockUsers);

      const result = await controller.listUsers();

      expect(cognitoService.listUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should call CognitoService.createUser and return the result', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser1',
        email: 'testuser1@example.com',
        temporaryPassword: 'TempPassword123',
      };

      const mockUserResponse = {
        Username: 'testuser1',
        UserAttributes: [{ Name: 'email', Value: 'testuser1@example.com' }],
      };

      mockCognitoService.createUser.mockResolvedValue(mockUserResponse);

      const result = await controller.createUser(createUserDto);

      expect(cognitoService.createUser).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.email,
        createUserDto.temporaryPassword,
      );
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('setUserPassword', () => {
    it('should call CognitoService.setUserPassword and return the result', async () => {
      const setPasswordDto: SetPasswordDto = { password: 'NewPassword123' };
      const mockUsername = 'testuser1';

      const mockResponse = { status: 'Password set successfully' };
      mockCognitoService.setUserPassword.mockResolvedValue(mockResponse);

      const result = await controller.setUserPassword(mockUsername, setPasswordDto);

      expect(cognitoService.setUserPassword).toHaveBeenCalledWith(
        mockUsername,
        setPasswordDto.password,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('addUserToGroup', () => {
    it('should call CognitoService.addUserToGroup and return the result', async () => {
      const addUserToGroupDto: AddUserToGroupDto = { groupName: 'admin' };
      const mockUsername = 'testuser1';

      const mockResponse = { status: 'User added to group successfully' };
      mockCognitoService.addUserToGroup.mockResolvedValue(mockResponse);

      const result = await controller.addUserToGroup(mockUsername, addUserToGroupDto);

      expect(cognitoService.addUserToGroup).toHaveBeenCalledWith(
        mockUsername,
        addUserToGroupDto.groupName,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should call CognitoService.deleteUser and return the result', async () => {
      const mockUsername = 'testuser1';

      const mockResponse = { status: 'User deleted successfully' };
      mockCognitoService.deleteUser.mockResolvedValue(mockResponse);

      const result = await controller.deleteUser(mockUsername);

      expect(cognitoService.deleteUser).toHaveBeenCalledWith(mockUsername);
      expect(result).toEqual(mockResponse);
    });
  });
});
