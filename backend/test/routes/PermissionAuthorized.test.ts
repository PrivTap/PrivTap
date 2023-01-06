import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import OAuth from "../../src/helper/oauth";
import Authorization from "../../src/model/Authorization";
use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/Permission authorized endpoint", () => {
    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let authUri: SinonStub;
    let findStub: SinonStub;
    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });
    const serviceId = "someServiceId";
    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "someUserId",
            active: true
        });
        findStub = sandbox.stub(Authorization, "findAllPermissionsAddingAuthorizationTag");
        authUri = sandbox.stub(OAuth, "newAuthorizationUri").resolves("https://example.com");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should fail with no params", async () => {
            const res = await requester.get("/permission-authorized");
            expect(res).to.have.status(400);
        });
        it("should succeed", async () => {
            findStub.resolves(true);
            const res = await requester.get("/permission-authorized").query({ serviceId });
            expect(res).to.have.status(200);
        });
        it("should give internal server error if the find fail", async () => {
            findStub.resolves(null);
            const res = await requester.get("/permission-authorized").query({ serviceId });
            expect(res).to.have.status(500);
        });
    });
});