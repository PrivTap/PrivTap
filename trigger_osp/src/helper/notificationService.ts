import {NextFunction, Request, Response} from "express";
import env from "./env";
import Notifcation from "../model/Notification";
import axios from "axios";

export default abstract class NotificationService {

    static async checkNotification(request: Request, response: Response, next: NextFunction){
        if(request.method != "POST"){
            next();
            return;
        }
        console.log("Caught a post request");
        const endpoint = request.baseUrl;
        const associatedTrigger = env.TRIGGERS[endpoint];
        await NotificationService.manageRequestedNotification(request.userId, associatedTrigger);
        next();
    }

    private static async manageRequestedNotification(userId: string, triggerName: string){
        const notifications = await Notifcation.find(userId, triggerName);
        const apiKey = env.API_KEY;
        if(!notifications)
            return;
        notifications.forEach(notification => {
            const data = { "triggerId": notification.foreignTriggerId, "userId": notification.foreignUserId, apiKey };
            axios.post(env.PRIVTAP_NOTIFICATION_URL, { data });
        })
    }
}