import { setupGracefulShutdown } from 'nestjs-graceful-shutdown'
import { join } from 'node:path'

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from '@app/app.module'

import { EnvConfig } from './env.config'
import { OpenApiConfig } from './open-api/open.config'

export class ServerConfig {
  private readonly envConfig: EnvConfig
  private readonly openApiConfig: OpenApiConfig
  constructor() {
    this.envConfig = new EnvConfig()
    this.openApiConfig = new OpenApiConfig()
  }

  async init() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    const prefix = this.envConfig.get('server').prefix
    setupGracefulShutdown({ app })

    // Configurar pasta pública para servir arquivos estáticos
    app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
      prefix: '/'
    })

    app.enableCors({
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      origin: this.envConfig.get('server').corsOrigins
    })

    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    app.setGlobalPrefix(prefix)
    this.openApiConfig.init(app)

    const port: number = this.envConfig.get('server').port
    await app
      .listen(port)
      .then(() => {
        console.log(`Listening on port: ${port}`)
      })
      .catch(err => {
        console.log(`Unable to stabilish connection:: ${err.message}`)
      })
  }
}
