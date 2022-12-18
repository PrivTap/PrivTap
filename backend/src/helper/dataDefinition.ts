import { DataType, isAggregate } from "./dataType";

/**
 * The interface of a data model definition for the trigger output and action input
 */
export interface DataDefinition {
    trigger_data: EntryDefinition[];
}

/**
 * The internal interface object used to define entries in the data definition object
 */
interface EntryDefinition {
    identifier?: string, //Undefined only for subtypes
    type: DataType,
    content?: EntryDefinition //Defined ONLY for aggregate types
}

/**
 * Checks whether the trigger and action data definition objects are compatible
 * @param trigger The trigger data definition object
 * @param action The action data definition object
 */
export function checkCompatibility(trigger: DataDefinition, action: DataDefinition): boolean {
    let isCompatible = true;

    for (let i = 0; i < action.trigger_data.length; i++) {
        const entry = action.trigger_data[i];
        //Find a corresponding entry in the trigger definition
        let foundEntry = false;
        for (let j = 0; j < trigger.trigger_data.length; j++) {
            const triggerEntry = trigger.trigger_data[j];
            const compatible = checkEntryCompatibility(triggerEntry, entry, true);
            if (compatible) {
                foundEntry = true;
                break;
            }
        }
        if (!foundEntry) {
            isCompatible = foundEntry;
            break;
        }
    }
    return isCompatible;
}

/**
 * Checks whether two data definition entries are compatible, recursively if needed for aggregate types
 * @param triggerEntry An entry in teh trigger data definition object
 * @param actionEntry An entry in the action data definition object
 * @param isTopLevel Whether the call is performed for entries at the top level (therefore requiring the existence of identifiers)
 */
function checkEntryCompatibility(triggerEntry: EntryDefinition, actionEntry: EntryDefinition, isTopLevel: boolean): boolean {
    if (triggerEntry.identifier == actionEntry.identifier &&
        triggerEntry.type == actionEntry.type &&
        (!isTopLevel || triggerEntry.identifier != undefined)) {
        //We found an entry with same ID and type. Now we check if the data subtype is coherent (if exists), otherwise we only need to check if it is equal
        if (actionEntry.content && triggerEntry.content && isAggregate(actionEntry.type)) {
            //Recursively check the content
            return checkEntryCompatibility(triggerEntry.content, actionEntry.content, false);
        } else {
            return triggerEntry.content == actionEntry.content;
        }
    }
    return false;
}

/**
 * Extracts the identififers from all top-level entries in a data definition object
 * @param definition The data definition objects to extract IDs from
 */
export function dataDefinitionIDs(definition: DataDefinition): string[] {
    return definition.trigger_data.map((entry) => (entry.identifier ?? ""));
}