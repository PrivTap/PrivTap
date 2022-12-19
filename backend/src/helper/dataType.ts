/**
 * Enumeration containing data types that can be generated by triggers
 * and consumed by actions.
 */
export enum DataType {
    Text = "text",
    Image = "image/url",
    Video = "video/url",
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