import mongoose, { Schema } from "mongoose";
import Model from "../Model";
import axios from "axios";
import { GridFsStorage } from "multer-gridfs-storage";


/*const storage = new GridFsStorage({
    db: mongoose.connection,
    file: function (request, file) {
        //everytime this function is called it will create a file, with an automatic id,
        //it will be stored in "dataStore" and the contentType will be inferred from the request
        return {
            filename: "file_" + Date.now(),
            bucketName: "dataStore"
        };
    }
});*/


const gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "dataStore"
});


export interface IDataRuleExecution {
    apiKey: string,
    fileId: string,
    read: boolean
}

const dataRuleExecutionSchema = new Schema({
    apiKey: {
        type: Schema.Types.ObjectId,
        required: true
    },
    fileId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
});
// Build an unique index on tuple <userId, triggerId, actionId> to prevent duplicates
dataRuleExecutionSchema.index({ userId: 1, triggerId: 1, actionId: 1 }, { unique: true });

class dataRuleExecution extends Model<IDataRuleExecution> {

    constructor() {
        super("rule", dataRuleExecutionSchema);
    }

    /**
     * Given a url it will create a stream to get the resource and store it in database. It will return the id of the new created data
     */
    async storeData(url: string, apiKey: string) {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        const writeStream = gridFsBucket.openUploadStream("file_" + Date.now(), { contentType: response.data.contentType });
        response.data.pipe(writeStream);
        const fileId = writeStream.id.toString();
        const dataId= await this.insert({ apiKey, fileId });
        return dataId;
    }
}


export default new dataRuleExecution();