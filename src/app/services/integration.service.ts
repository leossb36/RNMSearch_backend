import { plainToInstance } from 'class-transformer'
import { firstValueFrom } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

import { EntityFactory } from '@app/utils/functions/factory'
import { ContainerMixin } from '@app/utils/mixin/container.mixin'
import { PageMeta, PageOptions, Pagination } from '@app/utils/schemas/request'

import { CreateInternalUserRequest } from '../schemas/requests/integration.request'
import {
  CharacterResponse,
  EpisodeResponse,
  LocationResponse,
  NestedEpisodeResponse,
  PaginatedEpisodesResponse
} from '../schemas/responses/integration'
import { SearchImagesService } from './search-image'

@Injectable()
export class IntegrationService extends ContainerMixin {
  private readonly baseUrl = this.env.get('integration').baseUrl

  constructor(
    private readonly httpService: HttpService,
    private readonly searchImagesService: SearchImagesService
  ) {
    super(IntegrationService.name)
  }

  async getNestedEpisodeDetail(dto: CreateInternalUserRequest): Promise<NestedEpisodeResponse> {
    try {
      const episode = await this.getDataFromResponse<EpisodeResponse>(`${this.baseUrl}/episode/${dto.episode_id}`)

      const characterIds = episode.characters.map(url => this.extractIdFromUrl(url))

      const characters: CharacterResponse[] = []
      for (const id of characterIds) {
        const character = await this.getDataFromResponse<CharacterResponse>(`${this.baseUrl}/character/${id}`)
        characters.push(character)
      }

      const validCharacters = characters.filter((char): char is CharacterResponse => char !== null)

      const locationIdsSet = new Set<number>()
      validCharacters.forEach(character => {
        if (character.location?.url) {
          locationIdsSet.add(this.extractIdFromUrl(character.location.url))
        }
        if (character.origin?.url) {
          locationIdsSet.add(this.extractIdFromUrl(character.origin.url))
        }
      })

      const locationIds = Array.from(locationIdsSet)

      const locations: LocationResponse[] = []
      for (const id of locationIds) {
        const location = await this.getDataFromResponse<LocationResponse>(`${this.baseUrl}/location/${id}`)
        locations.push(location)
      }

      const validLocations = locations.filter((loc): loc is LocationResponse => loc !== null)

      const episodeInstance = this.excludeField(episode, EpisodeResponse) as unknown as EpisodeResponse
      const episodeImage = await this.searchImagesService.searchEpisodeImage(episode.name, episode.episode)
      episodeInstance.image = episodeImage

      const charactersInstances = this.excludeField(
        validCharacters,
        CharacterResponse
      ) as unknown as CharacterResponse[]
      const locationsInstances = this.excludeField(validLocations, LocationResponse) as unknown as LocationResponse[]
      return {
        episode: episodeInstance,
        characters: charactersInstances,
        locations: locationsInstances
      }
    } catch (error) {
      throw new Error(`Erro ao buscar detalhes do episódio: ${error.message}`)
    }
  }

  async getNestedPaginatedEpisodes(pagination: PageOptions, search?: string): Promise<Pagination<EpisodeResponse>> {
    try {
      const take = pagination.take || 10
      const skip = pagination.skip || 0

      const apiPage = Math.floor(skip / 20) + 1
      const offsetInPage = skip % 20

      let url = `${this.baseUrl}/episode?page=${apiPage}`
      if (search) {
        url += `&name=${encodeURIComponent(search)}`
      }

      const response = await this.getDataFromResponse<PaginatedEpisodesResponse>(url)

      let episodesTransformed = await Promise.all(
        response.results.map(async episode => {
          const transformed = this.excludeField(episode, EpisodeResponse) as unknown as EpisodeResponse
          const image = await this.searchImagesService.searchEpisodeImage(episode.name, episode.episode)
          if (image) {
            transformed.image = image
          }
          return transformed
        })
      )

      if (pagination.order) {
        episodesTransformed = this.sorteByEp(episodesTransformed, pagination)
      }

      const paginatedData = episodesTransformed.slice(offsetInPage, offsetInPage + take)

      const remainingNeeded = take - paginatedData.length
      if (remainingNeeded > 0 && response.info.next) {
        const nextPageUrl = `${this.baseUrl}/episode?page=${apiPage + 1}`
        const nextResponse = await this.getDataFromResponse<PaginatedEpisodesResponse>(nextPageUrl)

        const nextEpisodes = await Promise.all(
          nextResponse.results.map(async episode => {
            const transformed = this.excludeField(episode, EpisodeResponse) as unknown as EpisodeResponse
            const image = await this.searchImagesService.searchEpisodeImage(episode.name, episode.episode)
            if (image) {
              transformed.image = image
            }
            return transformed
          })
        )

        if (pagination.order) {
          const combinedAndSorted = this.sorteByEp([...episodesTransformed, ...nextEpisodes], pagination)
          paginatedData.push(...combinedAndSorted.slice(offsetInPage + paginatedData.length, offsetInPage + take))
        } else {
          paginatedData.push(...nextEpisodes.slice(0, remainingNeeded))
        }
      }

      const pageMeta = new PageMeta({
        pageOptionsDto: {
          page: pagination.page,
          take: take,
          skip: skip
        },
        itemCount: response.info.count
      })

      return EntityFactory(Pagination<EpisodeResponse>, {
        data: paginatedData,
        meta: pageMeta
      })
    } catch (error) {
      throw new Error(`Erro ao buscar lista de episódios: ${error.message}`)
    }
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/')
    return Number.parseInt(parts.at(-1) || '0', 10)
  }

  private async getDataFromResponse<T>(url: string): Promise<T> {
    return await firstValueFrom<T>(
      this.httpService.get<T>(url).pipe(
        map(response => response.data),
        catchError(error => {
          throw new Error(error.message)
        })
      )
    )
  }

  private excludeField(response: any, target: any) {
    return plainToInstance(target, response, { excludeExtraneousValues: true })
  }

  private sorteByEp(episodesTransformed: EpisodeResponse[], pagination: PageOptions) {
    return episodesTransformed.sort((a, b) => {
      const parseEpisode = (episodeCode: string) => {
        const regex = /S(\d+)E(\d+)/
        const match = regex.exec(episodeCode)
        if (match) {
          return {
            season: Number.parseInt(match[1], 10),
            episode: Number.parseInt(match[2], 10)
          }
        }
        return { season: 0, episode: 0 }
      }

      const episodeA = parseEpisode(a.episode)
      const episodeB = parseEpisode(b.episode)

      if (pagination.order === 'ASC') {
        if (episodeA.season !== episodeB.season) {
          return episodeA.season - episodeB.season
        }
        return episodeA.episode - episodeB.episode
      } else {
        if (episodeA.season !== episodeB.season) {
          return episodeB.season - episodeA.season
        }
        return episodeB.episode - episodeA.episode
      }
    })
  }
}
