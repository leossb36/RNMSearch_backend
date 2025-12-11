import { Logger } from '@nestjs/common'

import { EnvConfig } from '@app/infra/env.config'

export class ContainerMixin {
  public readonly env: EnvConfig = new EnvConfig()
  private readonly logger: Logger

  constructor(className: string) {
    this.logger = new Logger(className)
  }

  public log_info(message: string): void {
    this.logger.log(message)
  }

  public log_error(message: string, trace?: string): void {
    this.logger.error(message, trace)
  }

  public log_warn(message: string): void {
    this.logger.warn(message)
  }
}
