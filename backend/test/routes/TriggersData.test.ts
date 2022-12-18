import { expect, request, use } from "chai";
import { createSandbox, SinonStub } from "sinon";
import app from "../../src/app";
import { beforeEach } from "mocha";
import Rule, { IRule } from "../../src/model/Rule";
import Trigger, { ITrigger } from "../../src/model/Trigger";
import { OperationDataType } from "../../src/helper/rule_execution";
import Action, { IAction } from "../../src/model/Action";
import chaiHttp = require("chai-http");
import sinonChai = require("sinon-chai");
import Service from "../../src/model/Service";
import OAuth from "../../src/helper/oauth";
import axios from "axios";

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
    let oauthTokenFinderStub: SinonStub;
    let triggerDataGetStub: SinonStub;
    let actionPostStub: SinonStub;

    // MOCK DATA
    const exampleTrigger: ITrigger = {
        _id: "0380b79b38dda0d2f6be3746",
        name: "Sample Trigger",
        description: "Trigger 1 desc",
        outputs: [OperationDataType.Text],
        serviceId: "8380b79b38dda0d2f6be3746",
        resourceServer: "https://www.sample.trigger/endpoint/triggerDataEndpoint"
    };

    const exampleAction: IAction = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Sample Action",
        description: "Trigger 2 desc",
        endpoint: "https://www.sample.action/endpoint/actionEndpoint",
        inputs: [OperationDataType.Text],
        serviceId: "9380b79b38dda0d2f6be3746",
    };

    const incompatibleExampleAction: IAction = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Sample Action",
        description: "Trigger 2 desc",
        endpoint: "https://www.sample.action/endpoint/actionEndpoint",
        inputs: [OperationDataType.Image],
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

    const exampleTriggerDataResponse = {
        status: 200,
        data: {
            trigger_data: [
                {
                    type: "text",
                    data: "Post Title"
                },
                {
                    type: "text",
                    data: "Lorem ipsum here is my post content"
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
        ruleFindStub = sandbox.stub(Rule, "find").resolves(mockRule);
        triggerFindStub = sandbox.stub(Trigger, "findById").resolves(exampleTrigger);
        actionFindStub = sandbox.stub(Action, "findById").resolves(exampleAction);
        serviceAPIKeyValidatorStub = sandbox.stub(Service, "isValidAPIKey").resolves(true);
        oauthTokenFinderStub = sandbox.stub(OAuth, "retrieveToken").resolves("ASampleOAuthTokenString");
        triggerDataGetStub = sandbox.stub(axios, "get").resolves(exampleTriggerDataResponse);
        actionPostStub = sandbox.stub(axios, "post").resolves({
            status: 200
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {

        it("should fail if one or more parameters are missing", async () => {
            let res = await requester.post(endpoint);
            expect(res).to.have.status(400);

            res = await requester.post(endpoint).send({
                triggerId: "ATriggerId",
                userId: "AUserId"
            });
            expect(res).to.have.status(400);

            res = await requester.post(endpoint).send({
                triggerId: "ATriggerId",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(400);

            res = await requester.post(endpoint).send({
                userId: "AUserId",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(400);
        });

        it("should fail if the trigger does not exist", async () => {
            triggerFindStub.restore();
            triggerFindStub = sandbox.stub(Trigger, "findById").resolves(null);

            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3747",
                userId: "AUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(403);
        });

        it("should fail if the user does not own the rule", async () => {
            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3746",
                userId: "ASecondUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(403);
        });

        it("should fail if the API Key is invalid", async () => {
            serviceAPIKeyValidatorStub.restore();
            serviceAPIKeyValidatorStub = sandbox.stub(Service, "isValidAPIKey").resolves(false);

            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3746",
                userId: "AUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(403);
        });

        it("should fail if the rule references an Action that does not exist", async () => {
            actionFindStub.restore();
            actionFindStub = sandbox.stub(Action, "findById").resolves(null);

            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3746",
                userId: "ASecondUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(500);
        });

        it("should fail if the trigger has a resource server but no OAuth token", async () => {
            oauthTokenFinderStub.restore();
            oauthTokenFinderStub = sandbox.stub(OAuth, "retrieveToken").resolves(null);

            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3746",
                userId: "AUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(403);
        });

        it("should succeed with correct parameters and authorization", async () => {
            const res = await requester.post(endpoint).send({
                triggerId: "0380b79b38dda0d2f6be3746",
                userId: "AUserID",
                apiKey: "AnAPIKey"
            });
            expect(res).to.have.status(403);
        });

    });
});