import Route from "../../Route";
import {Request, Response} from "express";
import {ITriggerData, TriggerDataUtils} from "../../helper/dataDefinition";
import {postReqHttp} from "../../helper/misc";

export default class CreatePostRoute extends Route {
    constructor() {
        super("middleware", false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const bearer = request.headers.authorization as string;
        const dataFromTrigger = (request.body as ITriggerData | undefined) ?? {trigger_data: []};
        const convertedData = TriggerDataUtils.convertToInternalRepresentation(dataFromTrigger);
        if (!convertedData) {
            response.status(400);
            return;
        }

        //Receive the data from the trigger internal resource server endpoint
        let axiosResponse;
        try {
            axiosResponse = await postReqHttp(request.protocol + '://' + request.get("host") + "/create-post", bearer, convertedData);
            if (axiosResponse?.status != 200) {
                console.log("error inserting post");
                response.status(500).send();
                return;
            }
        } catch (e) {
            console.log("Axios response status =", axiosResponse?.status, "Error:", e);
            response.status(500).send();
            return;
        }

        response.status(200).send();
    }

}