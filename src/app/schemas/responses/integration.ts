import { Exclude, Expose, Type } from 'class-transformer'
import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'

import { ApiHideProperty } from '@nestjs/swagger'

export class CharacterLocationResponse {
  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString()
  url: string
}

export class CharacterResponse {
  @Expose()
  @IsNumber()
  id: number

  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString()
  status: string

  @Expose()
  @IsString()
  species: string

  @Expose()
  @IsString()
  type: string

  @Expose()
  @IsString()
  gender: string

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterLocationResponse)
  origin: CharacterLocationResponse

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => CharacterLocationResponse)
  location: CharacterLocationResponse

  @Expose()
  @IsString()
  image: string

  @Exclude()
  @IsArray()
  @IsString({ each: true })
  @ApiHideProperty()
  episode: string[]

  @Expose()
  @IsString()
  url: string

  @Expose()
  @IsString()
  created: string
}

export class LocationResponse {
  @Expose()
  @IsNumber()
  id: number

  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString()
  type: string

  @Expose()
  @IsString()
  dimension: string

  @Exclude()
  @IsArray()
  @IsString({ each: true })
  residents: string[]

  @Expose()
  @IsString()
  url: string

  @Expose()
  @IsString()
  created: string
}

export class EpisodeResponse {
  @Expose()
  @IsNumber()
  id: number

  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString()
  air_date: string

  @Expose()
  @IsString()
  episode: string

  @Exclude()
  @IsArray()
  @IsString({ each: true })
  @ApiHideProperty()
  characters: string[]

  @Expose()
  @IsString()
  @IsOptional()
  image?: string

  @Expose()
  @IsString()
  url: string

  @Expose()
  @IsString()
  created: string
}

export class NestedEpisodeResponse {
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => EpisodeResponse)
  episode: EpisodeResponse

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterResponse)
  characters: CharacterResponse[]

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationResponse)
  locations: LocationResponse[]

  @Expose()
  @IsString()
  @IsOptional()
  episodeImage?: string = 'https://images.justwatch.com/poster/249537954/s718/season-1.jpg'
}

export class PaginationInfo {
  @Expose()
  @IsNumber()
  count: number

  @Expose()
  @IsNumber()
  pages: number

  @Expose()
  @IsString()
  next: string | null

  @Expose()
  @IsString()
  prev: string | null
}

export class PaginatedEpisodesResponse {
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationInfo)
  info: PaginationInfo

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EpisodeResponse)
  results: EpisodeResponse[]
}
