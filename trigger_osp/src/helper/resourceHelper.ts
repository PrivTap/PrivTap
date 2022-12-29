import User, {IUser} from "../model/User";
import Post from "../model/Post";

export default class ResourceHelper {

    private static triggers: {[id:string]: {[id:string]: string | string[]} } = {
        "/personal-page": {
            trigger: "Something has been posted",
            postGranularity: ["last"],
            userGranularity: ["none"]
        }
    }

    static retrieveTriggerData(endPoint:string): {trigger:string, postGranularity: string[], userGranularity:string[]}{
        return ResourceHelper.triggers[endPoint] as {trigger:string, postGranularity: string[], userGranularity:string[]};
    }

    static async getUserResource(userId: string, granularityKey: string): Promise<{username: string | undefined, email:string | undefined}>{
        let username;
        let email;
        let user = await User.findById(userId) as IUser;
        if (granularityKey == "username" || granularityKey == "all"){
            username = user.username;
        }
        if (granularityKey == "email" || granularityKey == "all"){
            email = user.email;
        }
        return { username, email };

    }

    static async getPostResource(userId: string, granularityKey: string): Promise<{content: string | undefined, creationDate: string | undefined}>{
        let content;
        let creationDate;
        let post = await Post.findLastByUserId(userId);
        if (granularityKey == "content" || granularityKey == "all"){
            content = post.content;
        }
        if (granularityKey == "date" || granularityKey == "all"){
            creationDate = post.creationDate.toLocaleString();
        }
        return { content, creationDate };
    }
}