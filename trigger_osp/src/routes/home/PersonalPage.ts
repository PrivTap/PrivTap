import Route from "../../Route";
import {Request, Response} from "express";
import Post from "../../model/Post";
import User from "../../model/User";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        let user = await User.findById(userId);
        // Dummy because the name is too long
        const dummy_user = {username: "Lorenzo"};
        let posts = await Post.findAllByUserId(userId)
        posts.forEach(post => {
            post.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
        });
        response.render("personal_page", {user: dummy_user, posts: posts});
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const content = request.body.content;
        const userId = request.userId;

        const successfulInsert = await Post.insert({ content, userId });

        if(!successfulInsert){
            response.status(500).send();
            return;
        }
        response.status(200).send();
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const postId = request.body.postId;
        const userId = request.userId;

        if (!await Post.isCreator(userId, postId)){
            response.status(401).send();
            return;
        }
        if (!await Post.delete(postId)){
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }
}