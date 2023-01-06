/**
 * Enumeration containing data types that can be generated by triggers
 * and consumed by actions.
 */

export enum DataType {
    Text = "text",
    Image = "image/url",
    URL = "other/url",
    Date = "date",
    Number = "number",
    Array = "aggregate/array"
}