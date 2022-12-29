import { model as mongooseModel, Schema } from "mongoose";

export interface IPost {
    _id: string;
    userId: string;
    content: string;
    creationDate: Date;
}

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: () => new Date()
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

    async findLastByUserId(userId: string): Promise<IPost>{
        const posts = await this.model.find({ userId }).sort({ creationDate: "descending" });
        return posts[0];
    }

    async isCreator(userId: string, postId: string): Promise<boolean>{
        const posts = await this.model.find({ userId });
        return posts.some(post => post._id == postId);
    }

    async delete(postId: string): Promise<boolean>{
        const deleteStatus = await this.model.deleteOne({ "_id" : postId }) as {deletedCount: number, acknowledged: boolean};
        return deleteStatus.deletedCount == 1;
    }
}

export default new Post();





