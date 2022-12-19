import Route from "../../Route";
import {Request, Response} from "express";
import Post, {IPost} from "../../model/Post";
import {Configuration, OpenAIApi} from "openai";

import env from "../../helper/env";

export default class CreatePostRoute extends Route {
    constructor() {
        super("create-post", true);
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