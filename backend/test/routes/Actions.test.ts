import { use, request, expect } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Action from "../../src/model/Action";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Authorization from "../../src/model/Authorization";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    const endpoint = "/actions";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllServicesAuthorizedByUserStub: SinonStub;
    let findAllForServiceStub: SinonStub;

    const service1 = { _id: "8380b79b38dda0d2f6be3746", name: "Service 1" };
    const service2 = { _id: "9380b79b38dda0d2f6be3746", name: "Service 2" };

    const action1 = { _id: "0380b79b38dda0d2f6be3746", name: "Action 1", description: "Action 1 desc" };
    const action2 = { _id: "1380b79b38dda0d2f6be3746", name: "Action 2", description: "Action 2 desc" };

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT")
            .returns({ userId: "test_user_id", active: true }); // User authenticated and account is active
        findAllServicesAuthorizedByUserStub = sandbox.stub(Authorization, "findAllServicesAuthorizedByUser")
            .resolves([
                { _id: "6380b79b38dda0d2f6be3746", service: service1 },
                { _id: "7380b79b38dda0d2f6be3746", service: service2 }]);
        findAllForServiceStub = sandbox.stub(Action, "findAllForService")
            .onFirstCall().resolves([action1])
            .onSecondCall().resolves([action2]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {

        it("should fail if the user is not authenticated", async () => {
            checkJWTStub.throws(new AuthError());

            const res = await requester.get(endpoint);
            expect(res).to.have.status(401);
        });

        it("should fail if the user account is not active", async () => {
            checkJWTStub.returns({ userId: "test_user_id", active: false });

            const res = await requester.get(endpoint);
            expect(res).to.have.status(403);
        });

        it("should return a list of actions for services that the user has authorized", async () => {
            const res = await requester.get(endpoint);
            expect(res).to.have.status(200);

            expect(findAllServicesAuthorizedByUserStub).to.have.been.calledOnceWith("test_user_id");
            expect(findAllForServiceStub).to.have.been.calledTwice;
            expect(findAllForServiceStub.firstCall.firstArg).to.be.equal(service1._id);
            expect(findAllForServiceStub.secondCall.firstArg).to.be.equal(service2._id);

            expect(res.body.data).to.deep.include(
                {
                    serviceName: service1.name,
                    serviceId: service1._id,
                    actions: [action1]
                });
            expect(res.body.data).to.deep.include(
                {
                    serviceName: service2.name,
                    serviceId: service2._id,
                    actions: [action2]
                });
        });

        it("should return an empty list if the user has not authorized any service", async () => {
            findAllServicesAuthorizedByUserStub.resolves(null);

            const res = await requester.get(endpoint);
            expect(res).to.have.status(200);

            expect(res.body.data).to.be.eql([]);
        });

    });
});


