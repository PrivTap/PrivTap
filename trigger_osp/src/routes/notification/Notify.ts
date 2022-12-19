import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Notification from "../../model/Notification";

export default class NotifyRoute extends Route {
    constructor() {
        super("notify", false, false);
    }

    // We're registering a new notification
    protected async httpPost(request: Request, response: Response): Promise<void> {
        const bearer = request.headers.authorization as string;
        const foreignUserId = request.body.userId;
        const foreignTriggerId = request.body.triggerId;
        const triggerName = request.body.triggerName;
        const oauthToken = bearer.split(" ")[1];

        console.log("headers =", request.headers);
        console.log("body =", request.body);

        console.log(oauthToken); // I'm not sure, maybe it contains bearer and has to be split

        const authorization = await Authorization.findByToken(oauthToken);

        if (!authorization){
            response.status(401).send();
            return;
        }

        const userId = authorization.userId;
        const doc = {
            userId,
            foreignUserId,
            foreignTriggerId,
            triggerName
        }
        if (!await Notification.insert(doc)){
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }

}