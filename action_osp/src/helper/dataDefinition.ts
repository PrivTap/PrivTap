import {DataType} from "./dataType";
import logger from "./logger";

/**
 * The interface of a data model definition for the trigger output and action input
 */
export interface ITriggerData {
    trigger_data: ITriggerDataEntry[];
}

/**
 * The internal interface object used to define entries in the data definition object
 */
export interface ITriggerDataEntry {
    identifier?: string, //Undefined only for subtypes
    type: DataType,
    data: unknown //The content of the entry
}

export class TriggerDataUtils {

    public static extractEntry(srcData: ITriggerData, identifier: string | undefined, dataType: DataType): ITriggerDataEntry | undefined {
        const entries = srcData.trigger_data;
        return entries.find((entry) => {
            if (identifier) {
                return entry.type == dataType && entry.identifier == identifier;
            }
            return entry.type == dataType;
        });
    }

    public static convertToInternalRepresentation(dataFromTrigger: ITriggerData): object | null {
        const postText = TriggerDataUtils.extractEntry(dataFromTrigger, "post-text", DataType.Text)?.data as string;

        if (!postText) {
            logger.debug("Wrongly formatted data from trigger");
            return null;
        }

        return {
            text: postText
        };
    }

}