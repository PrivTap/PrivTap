import { use, request, expect } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Authorization from "../../src/model/Authorization";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    const endpoint = "/actions";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllServicesAuthorizedByUserWithActionsStub: SinonStub;

    const service1 = { _id: "8380b79b38dda0d2f6be3746", name: "Service 1" };
    const service2 = { _id: "9380b79b38dda0d2f6be3746", name: "Service 2" };

    const action1 = { _id: "0380b79b38dda0d2f6be3746", name: "Action 1", description: "Action 1 desc" };
    const action2 = { _id: "1380b79b38dda0d2f6be3746", name: "Action 2", description: "Action 2 desc" };

    const serviceWithActions = [
        {
            serviceName: service1.name,
            serviceId: service1._id,
            actions: [action1]
        },
        {
            serviceName: service2.name,
            serviceId: service2._id,
            actions: [action2]
        }
    ];

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT")
            .returns({ userId: "test_user_id", active: true }); // User authenticated and account is active
        findAllServicesAuthorizedByUserWithActionsStub = sandbox.stub(Authorization, "findAllServicesAuthorizedByUserWithActions")
            .resolves(serviceWithActions);
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

            expect(findAllServicesAuthorizedByUserWithActionsStub).to.have.been.calledOnceWith("test_user_id");

            expect(res.body.data).to.be.eql(serviceWithActions);
        });

        it("should return an empty list if the user has not authorized any service", async () => {
            findAllServicesAuthorizedByUserWithActionsStub.resolves(null);

            const res = await requester.get(endpoint);
            expect(res).to.have.status(200);

            expect(res.body.data).to.be.eql([]);
        });

    });
});


