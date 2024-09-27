/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetPasswordDto {
  @ApiProperty({
    description: 'New password for the user',
    example: 'NewSecurePassword123!',
  })
  @IsString()
  password: string;
}
