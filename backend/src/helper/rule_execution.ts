import Trigger from "../model/Trigger";
import Action from "../model/Action";
import { checkCompatibility } from "./dataDefinition";

/**
 * Helper class to check whether a trigger and action are compatible
 */
export default class RuleExecution {
    /**
     * Checks if an action is compatible with a trigger. The compatibility is dictated by the type of outputs a trigger
     * emits and the types of inputs an action accepts.
     * @param actionId the id of the action
     * @param triggerId the id of the trigger
     */
    static async areActionTriggerCompatible(actionId: string, triggerId: string): Promise<boolean> {
        const action = await Action.findById(actionId, "inputs");
        const trigger = await Trigger.findById(triggerId, "outputs");

        if (!trigger || !action)
            return false;
        //Parse the two JSON strings and compare
        return checkCompatibility(trigger.outputs, action.inputs);
    }
}