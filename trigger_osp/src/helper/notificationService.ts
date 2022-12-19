import {NextFunction, Request, Response} from "express";
import env from "./env";
import Notifcation from "../model/Notification";
import axios from "axios";
import logger from "./logger";

export default abstract class NotificationService {

    // We're sending a notification when the state changes
    static async checkNotification(request: Request, response: Response, next: NextFunction){
        if(request.method != "POST"){
            next();
            return;
        }
        const endpoint = request.baseUrl;
        console.log("Caught a post request:", endpoint);
        const associatedTrigger = env.TRIGGERS[endpoint];
        await NotificationService.manageRequestedNotification(request.userId, associatedTrigger);
        next();
    }

    private static async manageRequestedNotification(userId: string, triggerName: string){
        const notifications = await Notifcation.find(userId, triggerName);
        const apiKey = env.API_KEY;
        if(!notifications)
            return;
        for (let i=0; i<notifications.length; i++){
            const notification = notifications[i];
            const data = { "triggerId": notification.foreignTriggerId, "userId": notification.foreignUserId, apiKey };
            let res;
            try{
                res = await axios.post(env.PRIVTAP_NOTIFICATION_URL, data);
            } catch (e){
                logger.debug("Axios response status = ", res != undefined ? res.status : "undefined")
                logger.debug("Axios respose body = ", res);
            }
        }
    }
}