
export class HttpException extends Error {
    status: number
    constructor (message, status) {
      super(message)
      this.status = status
      this.message = message
    }
  }
  

  