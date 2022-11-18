export class UserModel {
  username: string;
  email: string;
  isConfirmed: boolean;

  constructor(username: string, email: string, isConfirmed: boolean) {
    this.username = username;
    this.email = email;
    this.isConfirmed = isConfirmed;
  }
}
