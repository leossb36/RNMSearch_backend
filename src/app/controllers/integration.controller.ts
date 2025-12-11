import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ErrorFactory } from '@app/infra/handlers/error.handler'
import { ContainerMixin } from '@app/utils/mixin/container.mixin'
import { Pagination } from '@app/utils/schemas/request'

import { EpisodePaginationRequest } from '../schemas/requests/episode-pagination.request'
import { EpisodeResponse, NestedEpisodeResponse } from '../schemas/responses/integration'
import { IntegrationService } from '../services/integration.service'

@ApiTags('Integration')
@Controller('integrations')
export class IntegrationController extends ContainerMixin {
  constructor(private readonly integrationService: IntegrationService) {
    super(IntegrationController.name)
  }

  @Get('episode/:id')
  @ApiOperation({
    summary: 'Busca um episódio com detalhes completos de personagens e localizações'
  })
  async getNestedEpisodeDetail(@Param('id') episode_id: number): Promise<NestedEpisodeResponse> {
    try {
      this.log_info(`Iniciando consulta por episódio [${episode_id}]`)
      const response = await this.integrationService.getNestedEpisodeDetail({
        episode_id
      })
      this.log_info(`Consulta finalizada por episódio [${episode_id}]`)
      return response
    } catch (error) {
      this.log_error(`Erro consultar episódio (${episode_id}): ${error}`, error.stack)
      ErrorFactory.handle(error)
    }
  }

  @Get('episodes')
  @ApiOperation({ summary: 'Busca lista paginada de episódios' })
  async getNestedPaginatedEpisodes(
    @Query() pagination: EpisodePaginationRequest
  ): Promise<Pagination<EpisodeResponse>> {
    try {
      this.log_info(`Iniciando consulta de episódios paginados [página: ${pagination.page}]`)
      const response = await this.integrationService.getNestedPaginatedEpisodes(pagination, pagination.name)
      this.log_info(`Consulta finalizada de episódios paginados`)
      return response
    } catch (error) {
      this.log_error(`Erro ao consultar episódios: ${error}`, error.stack)
      ErrorFactory.handle(error)
    }
  }
}
