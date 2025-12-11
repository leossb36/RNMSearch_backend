import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC'
}

enum DefaultParams {
  DEFAULT_PAGE = 1,
  DEFAULT_TAKE = 10
}

export class PageOptions {
  @ApiPropertyOptional({ enum: OrderType, default: OrderType.ASC })
  @IsEnum(OrderType)
  @IsOptional()
  readonly order?: OrderType = OrderType.ASC

  @ApiPropertyOptional({
    minimum: 1,
    default: 1
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take?: number = DefaultParams.DEFAULT_TAKE

  get skip(): number {
    const page = this.page ?? DefaultParams.DEFAULT_PAGE
    const take = this.take ?? DefaultParams.DEFAULT_TAKE
    return (page - 1) * take
  }
}

interface PageMetaParameters {
  pageOptionsDto: PageOptions
  itemCount: number
}

export class PageMeta {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly itemCount: number

  @ApiProperty()
  readonly pageCount: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  constructor({ pageOptionsDto, itemCount }: PageMetaParameters) {
    this.page = pageOptionsDto.page ?? DefaultParams.DEFAULT_PAGE
    this.take = pageOptionsDto.take ?? DefaultParams.DEFAULT_TAKE
    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}

export class Pagination<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[]

  @ApiProperty({ type: () => PageMeta })
  readonly meta: PageMeta

  constructor(data: T[], meta: PageMeta) {
    this.data = data
    this.meta = meta
  }
}
