/// Build class for the service

export default class ServiceModel {
  _id: string;
  name: string;
  description: string;
  creator: string;
  authServer: string;
  clientId: string;
  clientSecret: string;
  v: number;

  constructor(
    serviceId: string,
    name: string,
    description: string,
    creator: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    v: number
  ) {
    this._id = serviceId;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.authServer = authServer;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.v = v;
  }
}
