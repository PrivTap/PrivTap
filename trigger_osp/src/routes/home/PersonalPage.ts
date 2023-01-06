import Route from "../../Route";
import {Request, Response} from "express";
import Post from "../../model/Post";
import User from "../../model/User";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page", true, true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        let user = await User.findById(userId);
        // Dummy because the name is too long
        const dummy_user = {username: user?.username ?? "Lorenzo"};
        const postList = await Post.findAllByUserId(userId)
        let formattedList: [{[id: string]: string }?] = [];
        postList.forEach(post => {
            let formattedPost: {[id: string] : string} = {};
            formattedPost._id = post._id;
            formattedPost.content = post.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
            formattedPost.creationDate = "Posted at: " + post.creationDate.toLocaleString();
            formattedList.push(formattedPost);
        });

        response.render("personal_page", {user: dummy_user, posts: formattedList});
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