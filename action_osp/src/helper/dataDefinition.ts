import { DataType } from "./dataType";

/**
 * The interface of a data model definition for the trigger output and action input
 */
export interface IDataDefinition {
    trigger_data: IEntryDefinition[];
}

/**
 * The internal interface object used to define entries in the data definition object
 */
export interface IEntryDefinition {
    identifier?: string, //Undefined only for subtypes
    type: DataType,
    data: unknown //The content of the entry
}