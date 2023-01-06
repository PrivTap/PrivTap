import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import { beforeEach } from "mocha";
import app from "../../src/app";
import Action from "../../src/model/Action";
import Authentication from "../../src/helper/authentication";
import RuleExecution from "../../src/helper/rule_execution";


use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    const endpoint = "/actions";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllActionAddingAuthorizedTagStub: SinonStub;
    let areActionTriggerCompatibleStub: SinonStub;
    const exampleServiceId = "serviceId";
    const examplePerm1 = { _id: "8380b79b38dda0d2f6be3746", name: "Service 1", desc: " Perm 1 desc" };
    const examplePerm2 = { _id: "9380b79b38dda0d2f6be3746", name: "Service 2", desc: "Perm 2 desc" };
    const triggerId = "triggerId";
    const exampleAction1 = {
        _id: "0380b79b38dda0d2f6be3746",
        name: "Action 1",
        description: "Action 1 desc",
        permissions: [examplePerm2, examplePerm1],
        resourceServer: "http://resource.com"
    };
    const exampleAction2 = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Action 2",
        description: "Action 2 desc",
        permissions: [examplePerm2, examplePerm1]
    };

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        findAllActionAddingAuthorizedTagStub = sandbox.stub(Action, "findAllActionAddingAuthorizedTag");
        areActionTriggerCompatibleStub = sandbox.stub(RuleExecution, "areActionTriggerCompatible");
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
        it("should return all the Action with the permission populated", async () => {
            findAllActionAddingAuthorizedTagStub.returns([exampleAction1, exampleAction2]);
            const res = await requester.get(endpoint).query({ serviceId: exampleServiceId });
            expect(findAllActionAddingAuthorizedTagStub).to.have.been.calledOnceWith("test_user_id", exampleServiceId);
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleAction1, exampleAction2]);
        });
        it("should return all the Action with the permission populated and compatible", async () => {
            const exampleArray = [exampleAction1, exampleAction2];
            findAllActionAddingAuthorizedTagStub.returns(exampleArray);
            areActionTriggerCompatibleStub.returns(true);
            const res = await requester.get(endpoint).query({ serviceId: exampleServiceId, triggerId: triggerId });
            expect(findAllActionAddingAuthorizedTagStub).to.have.been.calledOnceWith("test_user_id", exampleServiceId);
            expect(areActionTriggerCompatibleStub).to.have.been.callCount(exampleArray.length);
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleAction1, exampleAction2]);
        });
        it("should fail if the user account is not active", async () => {
            checkJWTStub.returns({ userId: "test_user_id", active: false });

            const res = await requester.get(endpoint);
            expect(res).to.have.status(403);
        });
        it("should fail if there is a problem with the database", async () => {
            findAllActionAddingAuthorizedTagStub.resolves(null);
            const res = await requester.get(endpoint).query({ serviceId: exampleServiceId });
            expect(res).to.have.status(500);
        });
    });
});