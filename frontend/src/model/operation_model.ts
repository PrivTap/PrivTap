export class OperationModel {
  id: string;
  name: string;
  description: string;
  operationType: OperationType;

  constructor(
    id: string,
    name: string,
    description: string,
    operationType: OperationType
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.operationType = operationType;
  }
}
enum OperationType {
  TRIGGER,
  ACTION,
}
