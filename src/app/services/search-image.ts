import { Injectable } from '@nestjs/common'

import { ContainerMixin } from '@app/utils/mixin/container.mixin'

@Injectable()
export class SearchImagesService extends ContainerMixin {
  private readonly baseUrl: string

  constructor() {
    super(SearchImagesService.name)
    this.baseUrl =
      this.env.get('server').environment === 'production' ? this.env.get('server').url : 'http://localhost:3001'
  }

  async searchEpisodeImage(episodeName: string, episodeCode: string): Promise<string> {
    const seasonNumber = this.extractSeasonNumber(episodeCode)
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

    return 1
  }
}
