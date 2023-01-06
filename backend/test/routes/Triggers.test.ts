import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import { beforeEach } from "mocha";
import app from "../../src/app";
import Trigger from "../../src/model/Trigger";
import Authentication from "../../src/helper/authentication";
import RuleExecution from "../../src/helper/rule_execution";


use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/triggers endpoint", () => {

    const endpoint = "/triggers";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllTriggerAddingAuthorizedTagStub: SinonStub;
    let areTriggerTriggerCompatibleStub: SinonStub;
    const exampleServiceId = "serviceId";
    const examplePerm1 = { _id: "8380b79b38dda0d2f6be3746", name: "Service 1", desc: " Perm 1 desc" };
    const examplePerm2 = { _id: "9380b79b38dda0d2f6be3746", name: "Service 2", desc: "Perm 2 desc" };
    const exampleTrigger1 = {
        _id: "0380b79b38dda0d2f6be3746",
        name: "Trigger 1",
        description: "Trigger 1 desc",
        permissions: [examplePerm2, examplePerm1],
        resourceServer: "http://resource.com"
    };
    const exampleTrigger2 = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Trigger 2",
        description: "Trigger 2 desc",
        permissions: [examplePerm2, examplePerm1]
    };

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        findAllTriggerAddingAuthorizedTagStub = sandbox.stub(Trigger, "findAllTriggerAddingAuthorizedTag");
        areTriggerTriggerCompatibleStub = sandbox.stub(RuleExecution, "areActionTriggerCompatible");
        checkJWTStub = sandbox.stub(Authentication, "checkJWT")
            .returns({ userId: "test_user_id", active: true }); // User authenticated and account is active
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should return 400 if the service Id is not specified", async () => {
            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
        });
        it("should return all the Trigger with the permission populated", async () => {
            findAllTriggerAddingAuthorizedTagStub.returns([exampleTrigger1, exampleTrigger2]);
            const res = await requester.get(endpoint).query({ serviceId: exampleServiceId });
            expect(findAllTriggerAddingAuthorizedTagStub).to.have.been.calledOnceWith("test_user_id", exampleServiceId);
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleTrigger1, exampleTrigger2]);
        });
        it("should fail if the user account is not active", async () => {
            checkJWTStub.returns({ userId: "test_user_id", active: false });
            const res = await requester.get(endpoint);
            expect(res).to.have.status(403);
        });
        it("should fail if there is a problem with the database", async () => {
            findAllTriggerAddingAuthorizedTagStub.resolves(null);
            const res = await requester.get(endpoint).query({ serviceId: exampleServiceId });
            expect(res).to.have.status(500);
        });
    });
});