/// Build class for the service
export default class ServiceModel {
  serviceId: string;
  name: string;
  description: string;
  creator: string;
  authServer: string;
  clientId: string;
  clientSecret: string;

  constructor(
    serviceId: string,
    name: string,
    description: string,
    creator: string,
    authServer: string,
    clientId: string,
    clientSecret: string
  ) {
    this.serviceId = serviceId;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.authServer = authServer;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
}
