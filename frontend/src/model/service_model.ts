/// Build class for the service

export default class ServiceModel {
  _id: string;
  name: string;
  description: string;
  creator: string;
  baseUrl?: string;
  authPath?: string;
  tokenPath?: string;
  clientId?: string;
  clientSecret?: string;

  constructor(
    serviceId: string,
    name: string,
    description: string,
    creator: string,
    baseUrl?: string,
    authPath?: string,
    tokenPath?: string,
    clientId?: string,
    clientSecret?: string,
  ) {
    this._id = serviceId;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.baseUrl = baseUrl;
    this.authPath=authPath;
    this.tokenPath=tokenPath;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
}
