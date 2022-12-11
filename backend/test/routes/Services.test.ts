import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Service, { IService } from "../../src/model/Service";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/services endpoint", () => {
    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllStub: SinonStub;

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
        findAllStub = sandbox.stub(Service, "findAll").resolves([{}] as IService[]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.get("/services");
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/services");
            expect(res).to.have.status(401);
        });

        it ("should fail if an internal error occurs", async () => {
            findAllStub.resolves(null);
            const res = await requester.get("/services");
            expect(res).to.have.status(500);
        });

        it ("should succeed if the user is correctly authenticated and no internal error occurs", async () => {
            const res = await requester.get("/services");
            expect(res).to.have.status(200);
        });
    });

});


