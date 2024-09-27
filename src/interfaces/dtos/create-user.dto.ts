/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the new user',
    example: 'testuser1',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email of the new user',
    example: 'testuser1@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Temporary password for the new user',
    example: 'TemporaryPassword123!',
  })
  @IsString()
  temporaryPassword: string;
}
