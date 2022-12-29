export function isValidUrlRegex(url: string): boolean {
    /*

    TODO: Commented out for testing purposes

    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
        url
    );

     */
    return true;
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
 * Enumeration containing data types that can be generated by triggers
 * and consumed by actions.
 */
export enum DataType {
    Text = "text",
    Image = "image/url",
    URL = "other/url",
    Date = "date",
    DateTime = "datetime",
    Number = "number",
    Array = "aggregate/array"
}

/**
 * Returns whether a data type is aggregate or not
 * @param dataType The data type to check
 */
export function isAggregate(dataType: DataType): boolean {
    return dataType == DataType.Array;
}

export function isValidEntryDefinition(dataDefinition: string): boolean | string {
    const msg = "Must be a valid JSON array (or empty), containing objects with the following properties: identifier (string), type (string), content (object)"
    try {
        console.log("here");
        return !!(JSON.parse(dataDefinition) as EntryDefinition[]) ? true : msg;
    } catch (err) {
        return msg;
    }
}