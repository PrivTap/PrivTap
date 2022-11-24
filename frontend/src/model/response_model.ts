export class StandartRepsonse<T extends Object> {
  status: boolean;
  message: string;
  data?: T;

  constructor(status: boolean, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
