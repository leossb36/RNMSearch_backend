import { Module } from '@nestjs/common'

import { IntegrationController } from '../controllers/integration.controller'
import { IntegrationService } from '../services/integration.service'
import { SearchImagesService } from '../services/search-image'

@Module({
  imports: [],
  controllers: [IntegrationController],
  providers: [IntegrationService, SearchImagesService]
})
export class IntegrationModule {}
