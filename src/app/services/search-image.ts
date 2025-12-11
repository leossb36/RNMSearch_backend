import { Injectable } from '@nestjs/common'

import { ContainerMixin } from '@app/utils/mixin/container.mixin'

@Injectable()
export class SearchImagesService extends ContainerMixin {
  private readonly baseUrl: string

  constructor() {
    super(SearchImagesService.name)
    // URL base para servir os assets (ajuste conforme sua configuração)
    this.baseUrl =
      this.env.get('server').environment === 'production' ? 'https://seu-dominio.com' : 'http://localhost:3001'
  }

  async searchEpisodeImage(episodeName: string, episodeCode: string): Promise<string> {
    // Extrai o número da temporada do código do episódio (ex: S01E01 -> 1)
    const seasonNumber = this.extractSeasonNumber(episodeCode)

    // Retorna a URL da imagem da temporada correspondente
    const imageUrl = `${this.baseUrl}/assets/seasons/season-${seasonNumber}.jpg`

    this.log_info(`Imagem da temporada ${seasonNumber} para episódio: ${episodeName} (${episodeCode})`)

    return imageUrl
  }

  private extractSeasonNumber(episodeCode: string): number {
    const regex = /S(\d+)E\d+/
    const match = regex.exec(episodeCode)

    if (match) {
      return Number.parseInt(match[1], 10)
    }

    // Retorna temporada 1 como padrão
    return 1
  }
}
