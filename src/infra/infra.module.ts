import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvConfig } from './env.config'
import { OpenApiConfig } from './open-api/open.config'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production']
    }),
    HttpModule
  ],
  providers: [EnvConfig, OpenApiConfig],
  exports: [HttpModule, EnvConfig]
})
export class InfraModule {}
