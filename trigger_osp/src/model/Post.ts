import { model as mongooseModel, Schema } from "mongoose";

export interface IPost {
    _id: string;
    userId: string;
    content: string;
}

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

class Post {
    model = mongooseModel<IPost>("post", postSchema);

    async insert(document: Partial<IPost>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            console.log("Error inserting post");
        }
        return false;
    }

    async findAllByUserId(userId: string): Promise<IPost[]>{
        return this.model.find({ userId });
    }
}

export default new Post();





