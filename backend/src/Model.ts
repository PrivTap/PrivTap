import { model as mongooseModel, Schema, Error as MongooseError, FilterQuery, UpdateQuery, Query } from "mongoose";
import { MongoServerError } from "mongodb";
import logger from "./helper/logger";

const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;

/**
 * Error that happens while executing inserts and updates in the model.
 */
export class ModelSaveError extends Error {
    errors?: { [path: string]: MongooseError.ValidatorError | MongooseError.CastError };

    constructor(message: string, errors?: { [path: string]: MongooseError.ValidatorError | MongooseError.CastError }) {
        super(message);
        this.errors = errors;
    }
}

export default class Model<T> {
    protected readonly name;
    protected readonly model;

    constructor(name: string, schema: Schema<T>) {
        this.name = name;
        this.model = mongooseModel<T>(name, schema);
    }

    /**
     * Inserts a new document into the database.
     * @param document the new document to insert
     * @protected
     */
    async insert(document: Partial<T>): Promise<string | null> {
        const newDocumentModel = new this.model(document);
        try {
            await newDocumentModel.save();
            return newDocumentModel._id;
        } catch (e) {
            this.handleMongooseSavingErrors(e);
        }
        return null;
    }

    /**
     * Inserts a new document into the database and returns it
     * @param document
     */
    async insertAndReturn(document: Partial<T>): Promise<T | null> {
        const newDocumentModel = new this.model(document);
        try {
            await newDocumentModel.save();
            return newDocumentModel;
        } catch (e) {
            this.handleMongooseSavingErrors(e);
        }
        return null;
    }

    /**
     * Updates a document in the database. Only the parameters that are defined will be updated, others will be not modified.
     * @param id the id of the document to update
     * @param documentUpdate the properties of the document to update
     * @param upsert if you also want to insert the document. Default false
     */
    async update(id: string, documentUpdate: Partial<T>, upsert = false): Promise<boolean> {
        try {
            const updateResult = await this.model.updateOne({ _id: id }, documentUpdate, { upsert: upsert });
            return updateResult.upsertedId != null || updateResult.modifiedCount == 1;
        } catch (e) {
            this.handleMongooseSavingErrors(e);
        }
        return false;
    }

    /**
     * Updates the first document in the database that matches the filter query.
     * Only the parameters that are defined will be updated, others will be not modified.
     * @param filter the query to find the document to update
     * @param documentUpdate the document containing the updates
     * @param upsert if you also want to insert the document. Default false
     */
    async updateWithFilter(filter: FilterQuery<T>, documentUpdate: Partial<T>, upsert = false): Promise<boolean> {
        try {
            console.log(documentUpdate);
            const updateResult = await this.model.updateOne(filter, documentUpdate, { upsert: upsert });
            return updateResult.upsertedId != null || updateResult.modifiedCount == 1;
        } catch (e) {
            this.handleMongooseSavingErrors(e);
        }
        return false;
    }

    /**
     * Updates the first document in the database that matches the filter query and returns it
     * Only the parameters that are defined will be updated, others will be not modified.
     * @param filter the query to find the document to update
     * @param documentUpdate the document containing the updates
     * @param upsert if you want to insert the document. Default false
     */
    async updateWithFilterAndReturn(filter: FilterQuery<T>, documentUpdate: Partial<T>, upsert = false): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate(filter, documentUpdate, { new: true, upsert: upsert });
        } catch (e) {
            this.handleMongooseSavingErrors(e);
        }
        return null;
    }

    /**
     * Deletes a document from the database.
     * @param id the id of the document to delete
     */
    async delete(id: string): Promise<boolean> {
        try {
            const res = await this.model.deleteOne({ _id: id });
            return res.deletedCount == 1;
        } catch (e) {
            logger.error(`Unexpected error while deleting ${this.name}\n`, e);
        }
        return false;
    }

    /**
     * Finds a document that matches the query.
     * @param query a key-value pair to be used as a query
     * @param select a selection string to include/exclude fields from the result (see Mongoose select())
     */
    async find(query: FilterQuery<T>, select?: string): Promise<T | null> {
        try {
            const findQuery = this.model.findOne(query);
            if (select)
                findQuery.select(select);
            return (await findQuery) as T;
        } catch (e) {
            logger.error(`Unexpected error while querying ${this.name}\n`, e);
        }
        return null;
    }

    /**
     * Finds a document with a matching id.
     * @param id the id of the document to find
     * @param select a selection string to include/exclude fields from the result (see Mongoose select())
     */
    async findById(id: string, select?: string): Promise<T | null> {
        try {
            const findQuery = this.model.findById(id);
            if (select)
                findQuery.select(select);
            return await findQuery;
        } catch (e) {
            logger.error(`Unexpected error while finding ${this.name}\n`, e);
        }
        return null;
    }

    /**
     * Updates the first document that matches the filter query and returns the updated version.
     * @param filterQuery the query to find the document to update
     * @param updateQuery the query to update the document
     */
    async findAndUpdate(filterQuery: FilterQuery<T>, updateQuery: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate(filterQuery, updateQuery, { new: true });
        } catch (e) {
            logger.error(`Unexpected error while finding and updating ${this.name}\n`, e);
        }

        return null;
    }

    /**
     * Finds all the documents that match the query.
     * @param query a key-value pair to be used as a query
     * @param select a selection string to include/exclude fields from the result (see Mongoose select())
     * @param populateRef a selection string that represents which fields you want to populate with external objects
     * @param populateSelect a selection string that represents which fields to include when populating objects
     */
    async findAll(query: FilterQuery<T> = {}, select?: string, populateRef?: string, populateSelect?: string): Promise<T[] | null> {
        try {
            let findQuery: Query<unknown, unknown> = this.model.find(query);
            if (select)
                findQuery = findQuery.select(select);
            if (populateRef) {
                findQuery = findQuery.populate(populateRef, populateSelect);
            }
            return (await findQuery) as T[];
        } catch (e) {
            logger.error(`Unexpected error while finding multiple ${this.name}s\n`, e);
        }
        return null;
    }

    /**
     * Handles Mongoose errors on saving about validation and duplicates. If an error of these types is detected, a corresponding ModelError will be thrown.
     * @param e the error to handle
     */
    private handleMongooseSavingErrors(e: unknown) {
        if (e instanceof Error) {
            if (e.name == "ValidationError") {
                // Schema validation has failed: a type cast has failed or one of the specified constraints is not respected
                const castedE: MongooseError.ValidationError = e as MongooseError.ValidationError;

                logger.debug(`Validation error in model ${this.name}\n`, castedE);

                throw new ModelSaveError(`This ${this.name} contains an invalid value`, castedE.errors);
            } else if (e.name == "MongoServerError") {
                // Mongoose can't check for duplicates on keys with unique indexes
                // Instead an error of this type will be thrown
                const castedE: MongoServerError = e as MongoServerError;

                // Check if the error is actually a duplicate key error
                if (castedE.code == MONGODB_DUPLICATE_KEY_ERROR_CODE) {
                    logger.debug(`Duplicate key in model ${this.name}: `, castedE);
                    throw new ModelSaveError(`This ${this.name} already exists`);
                }
            }
        }

        // If the error was not recognized, log it
        logger.error(`Unexpected error while inserting/updating ${this.name}\n`, e);
    }
}