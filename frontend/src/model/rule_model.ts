/// Build class for the rule

export default class RuleModel {
    _id: string;
    userId: string;
    triggerId: string;
    actionId: string;
    isAuthorized: boolean;
  
    constructor(
      ruleId: string,
      userId: string,
      triggerId: string,
      actionId: string,
      isAuthorized: boolean
  
    ) {
      this._id = ruleId;
      this.userId = userId;
      this.triggerId = triggerId;
      this.actionId = actionId;
      this.isAuthorized = isAuthorized;
    }
  }