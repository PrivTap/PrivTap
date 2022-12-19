import Route from "../../Route";
import {Request, Response} from "express";
import Post from "../../model/Post";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const postList = await Post.findAllByUserId(userId)
        let formattedList: [{ [id: string]: string | Buffer | undefined }?] = [];
        postList.forEach(post => {
            let formattedPost: { [id: string]: string | Buffer | undefined } = {};
            formattedPost._id = post._id;
            formattedPost.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
            formattedPost.creationDate = "Posted at: " + post.creationDate.toLocaleString();
            formattedPost.img = post.img;
            formattedList.push(formattedPost);
        });
        response.render("personal_page",  {posts: formattedList});
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const postId = request.body.postId;
        const userId = request.userId;

        if (!await Post.isCreator(userId, postId)) {
            response.status(401).send();
            return;
        }
        if (!await Post.delete(postId)) {
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }
}