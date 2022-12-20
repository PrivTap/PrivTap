import Route from "../../Route";
import {Request, Response} from "express";
import Post, {IPost} from "../../model/Post";
import {Configuration, OpenAIApi} from "openai";
import env from "../../helper/env";

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

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const content = request.body.content;
        if (content == undefined)
            response.status(400).send();
        const configuration = new Configuration({
            apiKey: env.AI_API_KEY
        });
        const openai = new OpenAIApi(configuration);
        let dataImg = undefined;
        try {
            dataImg = await openai.createImage({
                prompt: content,
                size: "256x256",
                response_format: "url"
            }, {timeout: 10000});

        } catch (error) {
            console.log(error);
        }
        const obj: Partial<IPost> = {
            content: content,
            userId: userId,
            img: dataImg?.data.data[0].url
        }
        if (await Post.insert(obj)) {
            response.status(200).send();
        } else
            response.status(500).send();
    }
}