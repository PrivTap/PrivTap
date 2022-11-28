import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Rule from "../../src/model/Rule";
import { beforeEach } from "mocha";

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

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "someUserId",
            active: true
        });
        findAllForUserStub = sandbox.stub(Rule, "findAllForUser");
        insertStub = sandbox.stub(Rule, "insert");
        deleteStub = sandbox.stub(Rule, "delete");
        isCreatorStub = sandbox.stub(Rule, "isCreator");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        // Confirmation flag
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.get("/rules");
            expect(res).to.have.status(403); // Forbidden
        });

        // Authentication flag
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/rules");
            expect(res).to.have.status(401); // Unauthorized
        });

        // Authentication flag
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const res = await requester.get("/rules");
            expect(res).to.have.status(500); // Unauthorized
        });

        it ("should succeed if the jwt is valid and no server error occurs", async () => {
            const someRule = [{
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            }];
            findAllForUserStub.resolves(someRule);
            const res = await requester.get("/rules");
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql(someRule);
        });
    });


    describe("POST /", () => {

        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.resolves({
                userId: "someUserId",
                active: false
            });
            const res = await requester.post("/rules");
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(500); // Unauthorized
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.post("/rules").send({});
            expect(res).to.have.status(400);
        });

        it ("should fail if a server error occurs", async () => {
            insertStub.resolves(false);
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the jwt is valid and no server error occurs", async () => {
            insertStub.resolves(true);
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            findAllForUserStub.resolves(someRule);
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {

        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.resolves({
                userId: "someUserId",
                active: false
            });
            isCreatorStub.resolves(true);
            const res = await requester.post("/rules");
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            isCreatorStub.resolves(true);
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(500); // Unauthorized
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            isCreatorStub.resolves(true);
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.delete("/rules").send({});
            expect(res).to.have.status(400);
        });

        it ("should fail if the jwt is valid but the rule has not been created by that specific user", async () => {
            isCreatorStub.resolves(false);
            deleteStub.throws();
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(403); // Unauthorized
        });

        it ("should fail if a server error occurs", async () => {
            deleteStub.resolves(false);
            isCreatorStub.resolves(true);
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the jwt is valid, is associated to the rule creator and no server error occurs", async () => {
            deleteStub.resolves(true);
            isCreatorStub.resolves(true);
            const someRuleId = {
                "ruleId": "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(200);
        });
    });
});