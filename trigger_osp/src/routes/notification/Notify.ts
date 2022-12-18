import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Notification from "../../model/Notification";

export default class NotifyRoute extends Route {
    constructor() {
        super("notify", false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const oauthToken = request.headers.authorization as string;
        const foreignUserId = request.body.userId;
        const foreignTriggerId = request.body.triggerId;
        const triggerName = request.body.triggerName;

        console.log(oauthToken); // Im not sure, maybe it contains bearer and has to be splitted

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