import { expect, request, use } from "chai";
import { createSandbox, SinonStub } from "sinon";
import app from "../../src/app";
import { beforeEach } from "mocha";
import Rule, { IRule } from "../../src/model/Rule";
import Trigger, { ITrigger } from "../../src/model/Trigger";
import Action, { IAction } from "../../src/model/Action";
import Service from "../../src/model/Service";
import { AxiosResponse } from "axios";
import chaiHttp = require("chai-http");
import sinonChai = require("sinon-chai");
import Authorization from "../../src/model/Authorization";
import * as misc from "../../src/helper/misc";
use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/triggers-data endpoint", () => {

    const endpoint = "/triggers-data";

    let requester: ChaiHttp.Agent;

    let ruleFindStub: SinonStub;
    let triggerFindStub: SinonStub;
    let actionFindStub: SinonStub;
    let serviceAPIKeyValidatorStub: SinonStub;
    let findTokenStub: SinonStub;
    let axiosGetStub: SinonStub;
    let checkActionDataFormatStub: SinonStub;
    let axiosPostStub: SinonStub;

    // MOCK DATA
    const exampleTrigger: ITrigger = {
        _id: "0380b79b38dda0d2f6be3746",
        name: "Sample Trigger",
        description: "Trigger 1 desc",
        outputs: "{\"trigger_data\": [{\"type\": \"text\", \"identifier\": \"title\"}]}",
        serviceId: "8380b79b38dda0d2f6be3746",
        resourceServer: "https://www.sample.trigger/endpoint/triggerDataEndpoint"
    };

    const exampleAction: IAction = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Sample Action",
        description: "Trigger 2 desc",
        endpoint: "https://www.sample.action/endpoint/actionEndpoint",
        inputs: "{\"trigger_data\": [{\"type\": \"text\", \"identifier\": \"title\"}]}",
        serviceId: "9380b79b38dda0d2f6be3746",
    };

    const mockRule: IRule = {
        _id: "MyRuleID",
        name: "Rule Name",
        userId: "AUserID",
        triggerId: "0380b79b38dda0d2f6be3746",
        actionId: "1380b79b38dda0d2f6be3746",
        isAuthorized: true
    };

    const data = {
        triggerId: "0380b79b38dda0d2f6be3747",
        userId: "AUserID",
        apiKey: "AnAPIKey"
    };

    const exampleTriggerDataResponse = {
        status: 200,
        data: {
            trigger_data: [
                {
                    type: "text",
                    identifier: "title",
                    data: "Post Title"
                }
            ]
        }
    };


    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        ruleFindStub = sandbox.stub(Rule, "findAll").resolves([mockRule]);
        triggerFindStub = sandbox.stub(Trigger, "findById").resolves(exampleTrigger);
        actionFindStub = sandbox.stub(Action, "findById").resolves(exampleAction);
        serviceAPIKeyValidatorStub = sandbox.stub(Service, "isValidAPIKey").resolves(true);
        findTokenStub = sandbox.stub(Authorization, "findToken").resolves("ASampleOAuthTokenString");
        axiosGetStub = sandbox.stub(misc, "getReqHttp").resolves(exampleTriggerDataResponse as AxiosResponse);
        checkActionDataFormatStub = sandbox.stub(misc, "checkActionDataFormat").returns(false);
        axiosPostStub = sandbox.stub(misc, "postReqHttp").resolves({ status: 200 } as AxiosResponse);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {
        it("should fail if one or more parameters are missing", async () => {
            const res = await requester.post(endpoint);
            expect(res).to.have.status(400);
        });

        it("should fail if the trigger does not exist", async () => {
            triggerFindStub.resolves(null);

            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(403);
        });

        it("should fail if the rule does not exist", async () => {
            ruleFindStub.resolves(null);

            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(403);
        });

        it("should fail if the API Key is invalid", async () => {
            serviceAPIKeyValidatorStub.resolves(false);

            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(403);
        });

        it("should fail if the rule references an Action that does not exist", async () => {
            actionFindStub.resolves(null);

            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(500);
        });

        it("should fail if the trigger has a resource server but no Trigger OAuth token", async () => {
            findTokenStub.resolves(null);

            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(403);
        });

        it("should fail if the axios GET response is different from 200", async () => {
            axiosGetStub.resolves({ status: 400 } as AxiosResponse);
            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(500);
        });

        it("should fail if there is not an Action OAuth token ", async () => {
            findTokenStub.onCall(0).resolves("ASampleOAuthTokenString");
            findTokenStub.resolves(null);
            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(500);
        });

        it("should fail if the data sent to the action platform is not compatible", async () => {
            checkActionDataFormatStub.returns(true);
            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(500);
        });

        it("should fail if the axios POST response is different from 200", async () => {
            axiosPostStub.resolves({ status: 400 } as AxiosResponse);
            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(500);
        });

        it("should succeed with correct parameters and authorization", async () => {
            const res = await requester.post(endpoint).send(data);
            expect(res).to.have.status(200);
        });

    });
});