import Route from "../../Route";
import {Request, Response} from "express";
import Post, {IPost} from "../../model/Post";
import {Configuration, OpenAIApi} from "openai";

import env from "../../helper/env";
import Authorization from "../../model/Authorization";

export default class CreatePostRoute extends Route {
    constructor() {
        super("create-post", false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        console.log("called POST");
        const content = request.body.content;
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];
        const authorization = await Authorization.findByToken(oauthToken);
        if (!authorization || !content){
            response.status(400).send();
            return;
        }
        const userId = authorization.userId;

        // TODO: Permission checking

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
        } catch (e) {
            console.log(e);
        }
        const post: Partial<IPost> = {
            content: content,
            userId: userId,
            img: dataImg?.data.data[0].url
        }
        if (!await Post.insert(post)) {
            response.status(500).send();
            return;
        }
        response.status(200).send();
    }

}