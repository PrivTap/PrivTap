import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import Rule from "../../src/model/Rule";
import Confirmation from "../../src/helper/confirmation";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/rules endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkValidationStub: SinonStub;
    let checkJWTStub: SinonStub;
    let findByUserIDStub: SinonStub;
    let insertNewRuleStub: SinonStub;
    let deleteRuleStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkValidationStub = sandbox.stub(Confirmation, "checkValidation");
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        findByUserIDStub = sandbox.stub(Rule, "findByUserID");
        insertNewRuleStub = sandbox.stub(Rule, "insertNewRule");
        deleteRuleStub = sandbox.stub(Rule, "deleteRule");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        // Confirmation flag
        it ("should fail if the user is not confirmed", async () => {
            checkValidationStub.resolves(false);
        });

        // Authentication flag
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const res = await requester.get("/rules");
            expect(res).to.have.status(401); // Unauthorized
        });

        it ("should succeed if the jwt is valid and no server error occurs", async () => {
            checkJWTStub.returns("someUserID");
            const someRule = {
                "userID": "someUserID",
                "triggerID": "someTriggerID",
                "actionID": "someActionID",
                "isAuthorized": true
            };
            const expectedBody = { "rules" : [someRule] };
            findByUserIDStub.resolves(someRule);
            const res = await requester.get("/rules");
            expect(res).to.have.status(200);
            expect(res).to.be.eql(expectedBody);
        });
    });


    describe("POST /", () => {

        it ("should fail if the user is not confirmed", async () => {

        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRule = {
                "userID": "someUserID",
                "triggerID": "someTriggerID",
                "actionID": "someActionID",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined", async () => {

        });

        it ("should fail if a server error occurs", async () => {
            checkJWTStub.returns("someUserID");
            insertNewRuleStub.resolves(false);
            const someRule = {
                "userID": "someUserID",
                "triggerID": "someTriggerID",
                "actionID": "someActionID",
                "isAuthorized": true
            };
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the jwt is valid and no server error occurs", async () => {
            checkJWTStub.returns("someUserID");
            insertNewRuleStub.resolves(true);
            const someRule = {
                "userID": "someUserID",
                "triggerID": "someTriggerID",
                "actionID": "someActionID",
                "isAuthorized": true
            };
            findByUserIDStub.resolves(someRule);
            const res = await requester.post("/rules").send(someRule);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws();
            const someRuleID = {
                "ruleID" : "someRuleID"
            };
            const res = await requester.delete("/rules").send(someRuleID);
            expect(res).to.have.status(401); // Unauthorized
        });

        it("should fail if some of the parameters are undefined", async () => {

        });

        it ("should fail if the rule doesn't exist", async () => {
            checkJWTStub.returns("someUserID");
            deleteRuleStub.throws();
            const someRuleID = {
                "ruleID" : "someRuleID"
            };
            const res = await requester.delete("/rules").send(someRuleID);
            expect(res).to.have.status(400);
        });

        it ("should fail if the jwt is valid but the rule has not been created by that specific user", async () => {
            checkJWTStub.returns("someUserID");
            deleteRuleStub.throws();
            const someRuleID = {
                "ruleID" : "someRuleID"
            };
            const res = await requester.delete("/rules").send(someRuleID);
            expect(res).to.have.status(401); // Unauthorized
        });

        it ("should fail if a server error occurs", async () => {
            checkJWTStub.returns("someID");
            deleteRuleStub.resolves(false);
            const someRuleID = {
                "ruleID" : "someRuleID"
            };
            const res = await requester.delete("/rules").send(someRuleID);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the jwt is valid, is associated to the rule creator and no server error occurs", async () => {
            checkJWTStub.returns("someID");
            deleteRuleStub.resolves(true);
            const someRuleID = {
                "ruleID" : "someRuleID"
            };
            const res = await requester.post("/rules").send(someRuleID);
            expect(res).to.have.status(200);
        });
    });
});