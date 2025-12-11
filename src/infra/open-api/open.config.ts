import { Injectable } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { ContainerMixin } from '@app/utils/mixin/container.mixin'

@Injectable()
export class OpenApiConfig extends ContainerMixin {
  constructor() {
    super(OpenApiConfig.name)
  }
  init(app) {
    const options = {
      definition: {
        info: {
          title: this.env.get('service').title,
          version: this.env.get('service').version,
          description: this.env.get('service').description
        }
      }
    }
    if (this.env.get('server').environment === 'production') return
    const config = new DocumentBuilder()
      .setTitle(options.definition.info.title)
      .setDescription(options.definition.info.description)
      .setVersion(options.definition.info.version)
      .setExternalDoc('Json document download URL', `/swagger.json`)
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(`${this.env.get('server').prefix}/docs`, app, document, {
      jsonDocumentUrl: 'swagger.json'
    })
  }
}
