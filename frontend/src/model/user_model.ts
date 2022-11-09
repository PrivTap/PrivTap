export class UserModel {
  id: string;
  username: string;
  email: string;

  constructor(id: string, username: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
