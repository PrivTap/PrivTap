import logger from "./logger";

/**
 * Error that happens while executing model methods.
 */
export class ModelError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export default class ModelHelper {

    /**
     * Handles Mongoose errors on saving about validation and duplicates. If an error of these types is detected, a corresponding ModelError will be thrown.
     * @param e the error to handle
     * @param duplicateErrorMessage the error message to show if a duplicate error is detected
     * @param validationErrorMessage the error message to show if a validation error is detected
     */
    static handleMongooseSavingErrors(e: unknown, duplicateErrorMessage = "This already exists in the database", validationErrorMessage = "Invalid parameters") {
        if (e instanceof Error) {
            if (e.name == "ValidationError") {
                throw new ModelError(validationErrorMessage);
            } else if (e.name == "MongoServerError") {
                throw new ModelError(duplicateErrorMessage);
            }
        }

        logger.error("Error while inserting/updating: ", e);
    }

}