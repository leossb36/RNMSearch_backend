import { IsOptional, IsString } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { PageOptions } from '@app/utils/schemas/request'

export class EpisodePaginationRequest extends PageOptions {
  @ApiPropertyOptional({
    description: 'Filtrar episódios por nome',
    example: 'Pilot'
  })
  @IsString()
  @IsOptional()
  readonly name?: string
}
