import { HttpException, HttpStatus } from '@nestjs/common'

import { API_DEFAULT_RESPONSE } from '@app/utils/constants/message'

export class NotFoundError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.NOT_FOUND, options?: any) {
    super(message, HttpStatus.NOT_FOUND, options)
  }
}

export class BadRequestError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.BAD_REQUEST, options?: any) {
    super(message, HttpStatus.BAD_REQUEST, options)
  }
}

export class ConflictError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.CONFLICT, options?: any) {
    super(message, HttpStatus.CONFLICT, options)
  }
}

export class UnauthorizedError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.UNAUTHORIZED, options?: any) {
    super(message, HttpStatus.UNAUTHORIZED, options)
  }
}

export class ForbiddenError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.FORBIDDEN, options?: any) {
    super(message, HttpStatus.FORBIDDEN, options)
  }
}

export class InternalServerError extends HttpException {
  constructor(message: string = API_DEFAULT_RESPONSE.INTERNAL_SERVER_ERROR, options?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, options)
  }
}

export class ErrorFactory {
  /**
   * Mapeamento de status HTTP para classes de erro
   */
  private static readonly statusMap: Record<number, new (message?: string, options?: any) => HttpException> = {
    [HttpStatus.BAD_REQUEST]: BadRequestError,
    [HttpStatus.UNAUTHORIZED]: UnauthorizedError,
    [HttpStatus.FORBIDDEN]: ForbiddenError,
    [HttpStatus.NOT_FOUND]: NotFoundError,
    [HttpStatus.CONFLICT]: ConflictError,
    [HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerError
  }

  /**
   * Mapeamento de nomes/strings para classes de erro
   */
  private static readonly nameMap: Record<string, new (message?: string, options?: any) => HttpException> = {
    // Bad Request variants
    badrequest: BadRequestError,
    bad_request: BadRequestError,
    'bad-request': BadRequestError,
    badrequesterror: BadRequestError,
    '400': BadRequestError,

    // Unauthorized variants
    unauthorized: UnauthorizedError,
    unauthorised: UnauthorizedError,
    unauthorizederror: UnauthorizedError,
    '401': UnauthorizedError,

    // Forbidden variants
    forbidden: ForbiddenError,
    forbiddenerror: ForbiddenError,
    '403': ForbiddenError,

    // Not Found variants
    notfound: NotFoundError,
    not_found: NotFoundError,
    'not-found': NotFoundError,
    notfounderror: NotFoundError,
    '404': NotFoundError,

    // Conflict variants
    conflict: ConflictError,
    conflicterror: ConflictError,
    '409': ConflictError,

    // Internal Server Error variants
    internalservererror: InternalServerError,
    internal_server_error: InternalServerError,
    'internal-server-error': InternalServerError,
    servererror: InternalServerError,
    '500': InternalServerError
  }

  /**
   * Mapeia diferentes tipos de erro para as classes de exceção apropriadas
   * @param error - Pode ser um número (status HTTP), string (nome do erro), objeto com propriedades status/code/name, ou HttpException
   * @param message - Mensagem personalizada (opcional)
   * @param options - Opções adicionais (opcional)
   * @returns HttpException apropriada
   */
  static create(error: any, message?: string, options?: any): HttpException {
    const ErrorClass = this.resolveErrorClass(error)
    return new ErrorClass(message, options)
  }

  /**
   * Resolve qual classe de erro usar baseado no parâmetro
   */
  private static resolveErrorClass(error: any): new (message?: string, options?: any) => HttpException {
    // Se já é uma HttpException, retorna ela mesma
    const existingError = this.handleExistingHttpException(error)
    return existingError || this.mapToErrorClass(error)
  }

  /**
   * Verifica se é uma HttpException existente
   */
  private static handleExistingHttpException(
    error: any
  ): (new (message?: string, options?: any) => HttpException) | null {
    return error instanceof HttpException ? ((() => error) as any) : null
  }

  /**
   * Mapeia o erro para uma classe de erro
   */
  private static mapToErrorClass(error: any): new (message?: string, options?: any) => HttpException {
    const processors = [
      () => this.processByNumber(error),
      () => this.processByString(error),
      () => this.processByObject(error)
    ]

    return processors.reduce((result, processor) => result || processor(), null) || InternalServerError
  }

  /**
   * Processa erro como número (status HTTP)
   */
  private static processByNumber(error: any): (new (message?: string, options?: any) => HttpException) | null {
    return typeof error === 'number' ? this.statusMap[error] || InternalServerError : null
  }

  /**
   * Processa erro como string (nome do erro)
   */
  private static processByString(error: any): (new (message?: string, options?: any) => HttpException) | null {
    return typeof error === 'string' ? this.nameMap[this.normalizeString(error)] || InternalServerError : null
  }

  /**
   * Processa erro como objeto
   */
  private static processByObject(error: any): (new (message?: string, options?: any) => HttpException) | null {
    const objectError = error && typeof error === 'object' ? error : null
    return objectError ? this.extractFromObject(objectError) : null
  }

  /**
   * Extrai informações do objeto de erro
   */
  private static extractFromObject(error: Record<string, any>): new (message?: string, options?: any) => HttpException {
    const extractors = [
      () => this.statusMap[error.status],
      () => this.statusMap[error.code],
      () => this.nameMap[this.normalizeString(error.name)]
    ]

    return extractors.reduce((result, extractor) => result || extractor?.(), null) || InternalServerError
  }

  /**
   * Normaliza string para busca no mapeamento
   */
  private static normalizeString(str: any): string {
    return typeof str === 'string' ? str.toLowerCase().replace(/[_\s-]/g, '') : ''
  }

  /**
   * Lança o erro apropriado (mantém compatibilidade com implementação anterior)
   * @param error - Qualquer tipo de erro
   * @param message - Mensagem personalizada (opcional)
   * @param options - Opções adicionais (opcional)
   */
  static handle(error: any, message?: string, options?: any): never {
    const resolvedError = error instanceof HttpException ? error : this.create(error, message, options)
    throw resolvedError
  }
}
