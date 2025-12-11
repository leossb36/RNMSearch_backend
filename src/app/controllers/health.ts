import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { EntityFactory } from '@app/utils/functions/factory'
import { DefaultResponse } from '@app/utils/schemas/response'

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  health(): DefaultResponse {
    return EntityFactory(DefaultResponse, {
      message: 'online'
    })
  }
}
