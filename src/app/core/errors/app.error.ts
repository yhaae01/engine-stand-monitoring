import { LoggerService } from '../services/logger.service';

abstract class AppError extends Error {
  suberror: any;
  override message: string;
  status: number;
  logger: LoggerService;

  constructor(
    message: string,
    status?: number,
    instance?: string,
    suberror?: any
  ) {
    super(message);
    this.message = message;
    this.status = status as number;
    this.suberror = suberror;
    this.logger = new LoggerService(
      instance === undefined ? AppError.name : instance
    );
    this.logger.error(message, suberror);
  }

  getNonUndefinedInstance(_instance: any, _default: any) {
    if (_instance === undefined) {
      return _default;
    }
    return _instance;
  }

  abstract serializeErrors():
    | { message: string; status: number; suberrors: any[] }[]
    | null;
}

export default AppError;
