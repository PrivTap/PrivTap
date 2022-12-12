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
        const posts = await Post.findAllByUserId(userId)
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
}