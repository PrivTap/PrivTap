import {NextFunction, Request, Response} from "express";
import env from "./env";
import Notifcation from "../model/Notification";
import axios from "axios";
import logger from "./logger";
import Authorization from "../model/Authorization";
import ResourceHelper from "./resourceHelper";

export default abstract class NotificationService {

    // We're sending a notification when the state changes
    static async checkNotification(request: Request, response: Response, next: NextFunction){
        if(request.method != "POST"){
            next();
            return;
        }
        const endpoint = request.baseUrl;
        console.log("Caught a post request:", endpoint);
        const triggerData = ResourceHelper.retrieveTriggerData(endpoint);
        const triggerName = triggerData.trigger;
        const postGranularity = triggerData.postGranularity;
        const userGranularity = triggerData.userGranularity;
        await NotificationService.manageRequestedNotification(request.userId, triggerName, postGranularity, userGranularity);
        next();
    }

    private static async manageRequestedNotification(userId: string, triggerName: string, postGranularity:string[], userGranularity: string[]){
        const notifications = await Notifcation.find(userId, triggerName);
        logger.debug("found", notifications?.length, "notifications associated to userId=", userId);
        const apiKey = env.API_KEY;
        if(!notifications)
            return;
        for (let i=0; i<notifications.length; i++){
            const notification = notifications[i];
            const resourceToRequest = JSON.stringify({
                "userGranularity": userGranularity,
                "postGranularity": postGranularity
            });
            console.log("resourceToRequest =", resourceToRequest);
            const data = { "triggerId": notification.foreignTriggerId, "userId": notification.foreignUserId, apiKey, resourceToRequest};
            try{
                console.log("posting to", env.PRIVTAP_NOTIFICATION_URL);
                // Do NOT await this request
                axios.post(env.PRIVTAP_NOTIFICATION_URL, data);
            } catch (e){
                logger.debug("Axios response != 200");
            }
        }
    }
}