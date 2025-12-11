interface ServiceConfig {
  title: string
  description: string
  version: string
  tag: string
}

interface ServerConfig {
  port: number
  environment: string
  corsOrigins: string
  prefix: string
  url: string
}

interface IntegrationConfig {
  baseUrl: string
}

interface EnvConfigMap {
  service: ServiceConfig
  server: ServerConfig
  integration: IntegrationConfig
}

export class EnvConfig {
  private readonly envConfig: EnvConfigMap

  constructor() {
    this.envConfig = {
      service: {
        title: process.env.SERVICE_TITLE || '',
        description: process.env.SERVICE_DESCRIPTION || '',
        version: process.env.SERVICE_VERSION || '',
        tag: process.env.SERVICE_TAG || ''
      },
      server: {
        port: Number.parseInt(process.env.SERVICE_PORT ?? '3001', 10),
        environment: process.env.NODE_ENV || 'development',
        corsOrigins: process.env.CORS_ORIGINS ?? '*',
        url: process.env.SERVER_URL || 'http://localhost:3001',
        prefix: '/api'
      },
      integration: {
        baseUrl: process.env.INTEGRATION_BASE_URL || 'https://rickandmortyapi.com/api'
      }
    }
  }

  get<K extends keyof EnvConfigMap>(key: K): EnvConfigMap[K] {
    return this.envConfig[key]
  }
}
