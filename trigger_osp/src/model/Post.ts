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

}

export default new Post();





