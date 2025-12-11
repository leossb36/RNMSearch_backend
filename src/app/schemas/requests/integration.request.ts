import { IsNotEmpty, IsNumber } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateInternalUserRequest {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  episode_id: number
}
