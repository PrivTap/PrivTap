export class StandartRepsonse<T> {
  status: boolean;
  message: String;
  data?: T;

  constructor(status: boolean, message: String, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
