export class DefaultResponse {
  readonly status?: number
  readonly message?: string
  readonly data?: unknown

  constructor(message?: string, status?: number, data?: unknown) {
    this.message = message
    this.status = status
    this.data = data
  }
}
