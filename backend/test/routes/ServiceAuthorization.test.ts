import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import OAuth from "../../src/helper/oauth";
import * as misc from "../../src/helper/misc";
import crypto from "bcrypt";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/ServiceAuthorization endpoint", () => {
    const examplePermission = {
        permissionId: "aa7f16b9d579d489c7d8ec65",
        name: "permissionName",
        description: "permissionDescription",
        serviceId: "567f16b9d579d489c7d8ec65",
        authorization_details: {}
    };
    const permissionId = [examplePermission.permissionId];
    const serviceId = examplePermission.serviceId;
    const exampleState = {
        _id: "aa7f16b9d579d489c7d8ec65",
        userId: "someUserId",
        serviceId: "567f16b9d579d489c7d8ec65",
        value: "someStateValue",
        permissionId: Array<string>()
    };

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let authUri: SinonStub;
    let insertStub: SinonStub;
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
        insertStub = sandbox.stub(misc, "handleInsert").resolves(true);
        authUri = sandbox.stub(OAuth, "newAuthorizationUri").resolves("https://example.com");
        sandbox.stub(crypto, "genSalt").resolves(true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {
        it("should fail with no params", async () => {
            const res = await requester.post("/service-authorization");
            expect(res).to.have.status(400);
        });
        it("should fail if the authUri fails", async () => {
            authUri.resolves(null);
            const res = await requester.post("/service-authorization").send({ serviceId, permissionId });
            expect(res).to.have.status(400);
        });
        it("should succeed", async () => {
            insertStub.resolves(exampleState);
            const res = await requester.post("/service-authorization").send({ serviceId, permissionId });
            expect(res).to.have.status(200);
            expect(authUri).to.have.been.calledOnce;
        });
    });
});