import type { OperationModel } from "./operation_model";

export class ServiceModel {
  id: string;
  name: string;
  description: string;
  auth_server: string;
  operations: OperationModel[];

  constructor(
    id: string,
    name: string,
    description: string,
    auth_server: string,
    operations: OperationModel[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.auth_server = auth_server;
    this.operations = operations;
  }
}
