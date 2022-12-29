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

    static getResource(){

    }
}