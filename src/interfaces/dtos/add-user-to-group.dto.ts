/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddUserToGroupDto {
  @ApiProperty({
    description: 'Name of the group to add the user to',
    example: 'admin',
  })
  @IsString()
  groupName: string;
}
