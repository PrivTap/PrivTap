import mongoose, { Schema, Types } from "mongoose";
import Model from "../Model";
import axios from "axios";
import app from "../app";
import logger from "../helper/logger";
import express from "express";
import { promisifiedPipe } from "promisified-pipe";


export interface IDataRuleExecution {
    apiKey: string,
    fileId: string,
}

const dataRuleExecutionSchema = new Schema({
    apiKey: {
        type: String,
        required: true
    },
    fileId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});
// Build an unique index on tuple <userId, triggerId, actionId> to prevent duplicates
dataRuleExecutionSchema.index({ userId: 1, triggerId: 1, actionId: 1 }, { unique: true });

class dataRuleExecution extends Model<IDataRuleExecution> {

    constructor() {
        super("dataRuleExecution", dataRuleExecutionSchema);
    }

    /**
     * Given a url it will create a stream to get the resource and store it in database. It will return the url where you can retrieve this resource
     * @param url: the url of the resource
     * @param token: the bearer token to use in the request
     * @param apiKeyAction: the key of the action service
     */
    async storeData(url: string, token: string, apiKeyAction: string): Promise<string | null> {
        const bucket = await app.getBucket();
        if (bucket === undefined) {
            logger.error("Bucket was not created");
            return null;
        }
        const response = await axios.get(url, {
            headers: { "Authorization": `Bearer ${token}` },
            responseType: "stream"
        });
        console.log(await response.headers["Content-Type"]);
        const writeStream = bucket.openUploadStream("file_" + Date.now(), { metadata: { type: response.headers["Content-Type"] } });
        //TODO see if it can be done with fetch
        try {
            await promisifiedPipe(response.data, writeStream);
        } catch (e) {
            logger.error(e);
            return null;
        }
        const fileId = writeStream.id.toString();
        //TODO how to generate the url
        let urlResource = "http://127.0.0.1";
        /*if (process.env.PROD) {
            urlResource = app.deploymentURL;
        }*/
        try {
            const dataId = await this.insert({ apiKey: apiKeyAction, fileId });
            if (dataId == null) return null;
            urlResource = urlResource + process.env.BASE_URL + "action-data?dataId=" + dataId;
            return urlResource;
        } catch (e) {
            return null;
        }

    }

    async downloadAndDeleteFile(dataId: string, fileId: string, response: express.Response): Promise<boolean> {
        const bucket = await app.getBucket();
        if (bucket === undefined) {
            logger.error("Bucket was not created");
            return false;
        }
        try {
            const file = await bucket.find({ _id: new Types.ObjectId(fileId) }).next();
            if (file != undefined) {
                if (file.metadata != undefined)
                    response.append("content-type", file.metadata.type);
                const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
                await promisifiedPipe(downloadStream, response);
                await bucket.delete(new Types.ObjectId(fileId));
                await this.delete(dataId);
            } else {
                return false;
            }
        } catch (e) {
            logger.error("error while trying to create the stream for ");
            return false;
        }

        return true;
    }
}

export default new

dataRuleExecution();