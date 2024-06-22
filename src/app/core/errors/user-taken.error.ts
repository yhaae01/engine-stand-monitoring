import { HttpStatusCode } from '@angular/common/http';
import AppError from './app.error';

class UserTakenError extends AppError {
  constructor(message: string, suberror: any[]) {
    super(message, HttpStatusCode.BadRequest, UserTakenError.name, suberror);
  }

  serializeErrors(): { message: string; status: number; suberrors: any[] }[] {
    return [
      { message: this.message, status: this.status, suberrors: this.suberror },
    ];
  }
}

export default UserTakenError;
