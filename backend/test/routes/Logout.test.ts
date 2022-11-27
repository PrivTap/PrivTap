import { use, request, expect } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import Logger from "../../src/helper/logger";
import { beforeEach } from "mocha";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/logout endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should succeed", async () => {
            checkJWTStub = sandbox.stub(Authentication, "checkJWT");
            checkJWTStub.returns("userId");
            const res = await requester.get("/logout");
            expect(res).to.have.status(200);
        });
    });
});