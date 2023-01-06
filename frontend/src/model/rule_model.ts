// Build class for the rule
 

export default class RuleModel {
    _id: string;
    name: string;
    triggerId: string;
    actionId: string;
    isAuthorized: boolean;
    constructor(
      ruleId: string,
      name: string,
      triggerId: string,
      actionId: string,
      isAuthorized: boolean,
    ) {
      this._id = ruleId;
      this.name = name;
      this.triggerId = triggerId;
      this.actionId = actionId;
      this.isAuthorized = isAuthorized;
    }
  }