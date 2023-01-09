import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Notification from "../../model/Notification";
import logger from "../../helper/logger";

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

        logger.debug("headers =", request.headers);
        logger.debug("body =", request.body);

        logger.debug(oauthToken);

        const authorization = await Authorization.findByToken(oauthToken);

        if (!authorization) {
            logger.debug("not authorized");
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
        if (!await Notification.insert(doc)) {
            logger.debug("error inserting notification");
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];
        const foreignTriggerId = request.query.triggerId as string;
        logger.debug("headers =", request.headers);
        logger.debug("query =", request.query);

        logger.debug(oauthToken);

        const authorization = await Authorization.findByToken(oauthToken);

        if (!authorization) {
            logger.debug("not authorized");
            response.status(401).send();
            return;
        }

        const userId = authorization.userId;
        if (!await Notification.delete(userId, foreignTriggerId)) {
            logger.debug("error inserting notification");
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }
}