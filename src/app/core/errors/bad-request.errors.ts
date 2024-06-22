import { HttpStatusCode } from '@angular/common/http';
import AppError from './app.error';

class BadRequestError extends AppError {
  constructor(message: string, suberror: any[]) {
    super(message, HttpStatusCode.BadRequest, BadRequestError.name, suberror);
  }

  serializeErrors(): { message: string; status: number; suberrors: any[] }[] {
    return [
      { message: this.message, status: this.status, suberrors: this.suberror },
    ];
  }
}

export default BadRequestError;
