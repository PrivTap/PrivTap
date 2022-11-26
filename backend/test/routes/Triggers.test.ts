import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Authorization from "../../src/model/Authorization";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/triggers endpoint", () => {

    const endpoint = "/triggers";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllServicesAuthorizedByUserStub: SinonStub;

    const service1 = { _id: "8380b79b38dda0d2f6be3746", name: "Service 1" };
    const service2 = { _id: "9380b79b38dda0d2f6be3746", name: "Service 2" };

    const trigger1 = { _id: "0380b79b38dda0d2f6be3746", name: "Trigger 1", description: "Trigger 1 desc" };
    const trigger2 = { _id: "1380b79b38dda0d2f6be3746", name: "Trigger 2", description: "Trigger 2 desc" };

    const serviceWithTriggers = [
        {
            serviceName: service1.name,
            serviceId: service1._id,
            triggers: [trigger1]
        },
        {
            serviceName: service2.name,
            serviceId: service2._id,
            triggers: [trigger2]
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
        findAllServicesAuthorizedByUserStub = sandbox.stub(Authorization, "findAllServicesAuthorizedByUserWithTriggers")
            .resolves(serviceWithTriggers);
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

        it("should return a list of triggers for services that the user has authorized", async () => {
            const res = await requester.get(endpoint);
            expect(res).to.have.status(200);

            expect(findAllServicesAuthorizedByUserStub).to.have.been.calledOnceWith("test_user_id");

            expect(res.body.data).to.be.eql(serviceWithTriggers);
        });

        it("should return an empty list if the user has not authorized any service", async () => {
            findAllServicesAuthorizedByUserStub.resolves(null);

            const res = await requester.get(endpoint);
            expect(res).to.have.status(200);

            expect(res.body.data).to.be.eql([]);
        });

    });
});


