import { GracefulShutdownModule } from 'nestjs-graceful-shutdown'

import { Module } from '@nestjs/common'

import { HealthController } from './app/controllers/health'
import { IntegrationModule } from './app/modules/integration.module'
import { InfraModule } from './infra/infra.module'

@Module({
  imports: [GracefulShutdownModule.forRoot(), InfraModule, IntegrationModule],
  controllers: [HealthController]
})
export class AppModule {}
