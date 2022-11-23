import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import Rule from "../../src/model/Rule";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/rules endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkActivationStub: SinonStub;
    let checkJWTStub: SinonStub;
    let findByUserIdStub: SinonStub;
    let insertNewRuleStub: SinonStub;
    let deleteRuleStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkActivationStub = sandbox.stub( Authentication, "checkActivation");
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        findByUserIdStub = sandbox.stub(Rule, "findByUserId");
        insertNewRuleStub = sandbox.stub(Rule, "insertNewRule");
        deleteRuleStub = sandbox.stub(Rule, "deleteRule");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        // Confirmation flag
        it ("should fail if the user is not confirmed", async () => {
            checkActivationStub.resolves(false);
        });

        // Authentication flag
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const res = await requester.get("/rules");
            expect(res).to.have.status(401); // Unauthorized
        });

        it ("should succeed if the jwt is valid and no server error occurs", async () => {
            checkJWTStub.returns("someUserId");
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            const expectedBody = { "rules" : [someRule] };
            findByUserIdStub.resolves(someRule);
            const res = await requester.get("/rules");
            expect(res).to.have.status(200);
            expect(res).to.be.eql(expectedBody);
        });
    });


    describe("POST /", () => {

        it ("should fail if the user is not confirmed");

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined");

        it ("should fail if a server error occurs", async () => {
            checkJWTStub.returns("someUserId");
            insertNewRuleStub.resolves(false);
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
            checkJWTStub.returns("someUserId");
            insertNewRuleStub.resolves(true);
            const someRule = {
                "userId": "someUserId",
                "triggerId": "someTriggerId",
                "actionId": "someActionId",
                "isAuthorized": true
            };
            findByUserIdStub.resolves(someRule);
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined");

        it ("should fail if the rule doesn't exist", async () => {
            checkJWTStub.returns("someUserId");
            deleteRuleStub.throws();
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(400);
        });

        it ("should fail if the jwt is valid but the rule has not been created by that specific user", async () => {
            checkJWTStub.returns("someUserId");
            deleteRuleStub.throws();
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(401); // Unauthorized
        });

        it ("should fail if a server error occurs", async () => {
            checkJWTStub.returns("someId");
            deleteRuleStub.resolves(false);
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.delete("/rules").send(someRuleId);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the jwt is valid, is associated to the rule creator and no server error occurs", async () => {
            checkJWTStub.returns("someId");
            deleteRuleStub.resolves(true);
            const someRuleId = {
                "ruleId" : "someRuleId"
            };
            const res = await requester.post("/rules").send(someRuleId);
            expect(res).to.have.status(200);
        });
    });
});