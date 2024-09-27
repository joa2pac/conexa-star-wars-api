import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/common/auth/guard/jwt-roles.guard';
import { Roles } from '@/common/auth/decorators/guard';
import { CognitoService } from '@/services/cognito/cognito.service';
import { CreateUserDto } from '@/interfaces/dtos/create-user.dto';
import { SetPasswordDto } from '@/interfaces/dtos/set-password.dto';
import { AddUserToGroupDto } from '@/interfaces/dtos/add-user-to-group.dto';

@ApiTags('Cognito')
@ApiOAuth2(['openid'])
@Controller('cognito')
export class CognitoController {
  constructor(private readonly cognitoService: CognitoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      example: [
        {
          Username: 'testuser1',
          UserAttributes: [{ Name: 'email', Value: 'testuser1@example.com' }],
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async listUsers() {
    return this.cognitoService.listUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'DTO to create a new user in Cognito',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    schema: {
      example: {
        Username: 'testuser1',
        UserAttributes: [{ Name: 'email', Value: 'testuser1@example.com' }],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.cognitoService.createUser(
      createUserDto.username,
      createUserDto.email,
      createUserDto.temporaryPassword,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('users/:username/password')
  @ApiOperation({ summary: 'Set a permanent password for a user' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiBody({
    type: SetPasswordDto,
    description: 'DTO to set a permanent password for a user',
  })
  @ApiResponse({
    status: 200,
    description: 'Password set successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async setUserPassword(
    @Param('username') username: string,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.cognitoService.setUserPassword(
      username,
      setPasswordDto.password,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('users/:username/groups')
  @ApiOperation({ summary: 'Add a user to a group' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiBody({
    type: AddUserToGroupDto,
    description: 'DTO to add a user to a group',
  })
  @ApiResponse({
    status: 200,
    description: 'User added to group successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async addUserToGroup(
    @Param('username') username: string,
    @Body() addUserToGroupDto: AddUserToGroupDto,
  ) {
    return this.cognitoService.addUserToGroup(
      username,
      addUserToGroupDto.groupName,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('users/:username')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'username', description: 'Username of the user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(@Param('username') username: string) {
    return this.cognitoService.deleteUser(username);
  }
}
