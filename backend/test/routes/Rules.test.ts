import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Rule from "../../src/model/Rule";
import { beforeEach } from "mocha";
import Trigger from "../../src/model/Trigger";
import Authorization from "../../src/model/Authorization";
import RuleExecution from "../../src/helper/rule_execution";
import * as misc from "../../src/helper/misc";
import Action from "../../src/model/Action";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/rules endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllForUserStub: SinonStub;
    let insertStub: SinonStub;
    let deleteStub: SinonStub;
    let isCreatorStub: SinonStub;
    let findByIdTriggerStub: SinonStub;
    let findByIdActionStub: SinonStub;
    let getNotificationServerStub: SinonStub;
    let getRuleNotificationServerStub: SinonStub;
    let findTokenStub: SinonStub;
    let postReqHttpStub: SinonStub;
    let areActionTriggerCompatibleStub: SinonStub;
    let findAllRuleStub: SinonStub;
    let deleteReqHttpStub: SinonStub;
    const exampleRule = {
        "ruleId": "5e9f9b9b9b9b9b9b9b9b9b9b",
        "name": "ruleName",
        "userId": "userId",
        "triggerId": "triggerId",
        "actionId": "actionId",
        "isAuthorized": true
    };
    const exampleTriggerService = {
        "serviceId": "serviceId",
        "triggerNotificationServer": "triggerNotificationServer"
    };
    const exampleTrigger = {
        "name": "triggerName",
        "serviceId": "serviceId",
        "userId": "userId"
    };
    const exampleAction = {
        "name": "triggerName",
        "serviceId": "serviceId1",
        "userId": "userId"
    };

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "userId",
            active: true
        });
        findAllForUserStub = sandbox.stub(Rule, "findAllForUser");
        insertStub = sandbox.stub(Rule, "insert");
        deleteStub = sandbox.stub(Rule, "delete");
        isCreatorStub = sandbox.stub(Rule, "isCreator").resolves(true);
        findByIdTriggerStub = sandbox.stub(Trigger, "findById");
        findByIdActionStub = sandbox.stub(Action, "findById");
        getNotificationServerStub = sandbox.stub(Trigger, "getTriggerServiceNotificationServer");
        getRuleNotificationServerStub = sandbox.stub(Rule, "getTriggerServiceNotificationServer");
        findTokenStub = sandbox.stub(Authorization, "findToken");
        postReqHttpStub = sandbox.stub(misc, "postReqHttp");
        areActionTriggerCompatibleStub = sandbox.stub(RuleExecution, "areActionTriggerCompatible");
        findAllRuleStub = sandbox.stub(Rule, "findAll");
        deleteReqHttpStub = sandbox.stub(misc, "deleteReqHttp");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        // Confirmation flag
        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "userId",
                active: false
            });
            const res = await requester.get("/rules");
            expect(res).to.have.status(403); // Forbidden
        });

        // Authentication flag
        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/rules");
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should succeed if the jwt is valid and no server error occurs", async () => {
            findAllForUserStub.resolves([exampleRule]);
            const res = await requester.get("/rules");
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleRule]);
        });
    });


    describe("POST /", () => {

        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.resolves({
                userId: "userId",
                active: false
            });
            const res = await requester.post("/rules");
            expect(res).to.have.status(403);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const res = await requester.post("/rules").send(exampleRule);
            expect(res).to.have.status(500); // Unauthorized
        });
        it("should fail if the trigger doesn't exist", async () => {
            findByIdTriggerStub.resolves(null);
            areActionTriggerCompatibleStub.resolves(true);
            const res = await requester.post("/rules").send(exampleRule);
            expect(res).to.have.status(400);
        });
        it("should fail if action and trigger are not compatible", async () => {
            findByIdTriggerStub.resolves(exampleTrigger);
            findByIdActionStub.resolves(exampleAction);
            areActionTriggerCompatibleStub.resolves(false);
            const res = await requester.post("/rules").send(exampleRule);
            expect(res).to.have.status(400);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.post("/rules").send(exampleRule);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.post("/rules").send({});
            expect(res).to.have.status(400);
        });

        it("should succeed if action and trigger exist and are compatible", async () => {
            insertStub.resolves(true);
            areActionTriggerCompatibleStub.resolves(true);
            findByIdTriggerStub.resolves(exampleTrigger);
            findByIdActionStub.resolves(exampleTrigger);
            findTokenStub.resolves(true);
            getNotificationServerStub.resolves(exampleTriggerService);
            const res = await requester.post("/rules").send(exampleRule);
            expect(res).to.have.status(200);
            expect(postReqHttpStub).to.have.been.calledOnce;
        });
    });

    describe("DELETE /", () => {

        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.resolves({
                userId: "userId",
                active: false
            });
            isCreatorStub.resolves(true);
            const res = await requester.post("/rules");
            expect(res).to.have.status(403);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            isCreatorStub.resolves(true);
            const res = await requester.delete("/rules").send(exampleRule);
            expect(res).to.have.status(500); // Unauthorized
        });

        it("should fail if the user is not the creator", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.delete("/rules").send(exampleRule);
            expect(res).to.have.status(403); // Forbidden
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.delete("/rules").send({});
            expect(res).to.have.status(400);
        });

        it("should succeed", async () => {
            deleteStub.resolves(true);
            findTokenStub.resolves(true);
            getRuleNotificationServerStub.resolves(exampleTriggerService);
            findAllRuleStub.resolves([]);
            const res = await requester.delete("/rules").send(exampleRule);
            expect(isCreatorStub).to.have.been.calledOnce;
            expect(res).to.have.status(200);
            expect(deleteReqHttpStub).to.have.been.calledOnce;
        });
    });
});