import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";

import app from "../../src/app";
import User from "../../src/model/User";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/activate endpoint", () => {

    let requester: ChaiHttp.Agent;
    let activateAccountStub: SinonStub;
    const sampleToken = "a_sample_token";

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        activateAccountStub = sandbox.stub(User, "activateAccount");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {

        it("should fail when called without token", async () => {
            const res = await requester.post("/activate");

            expect(res).to.have.status(400);
        });

        it("should fail when called with invalid token", async () => {
            activateAccountStub.resolves(false);

            const res = await requester.post("/activate").send({ token: sampleToken });

            expect(res).to.have.status(400);
            expect(activateAccountStub).to.have.been.calledOnceWith(sampleToken);
        });

        it("should succeed when called with valid token", async () => {
            activateAccountStub.resolves(true);

            const res = await requester.post("/activate").send({ token: sampleToken });

            expect(res).to.have.status(200);
            expect(activateAccountStub).to.have.been.calledOnceWith(sampleToken);
        });

    });

});