import { use, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";

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

    // TODO: Fix this
    /*
    describe("GET /", () => {
        it("should succeed", async () => {
            checkJWTStub = sandbox.stub(Authentication, "checkJWT");
            checkJWTStub.returns("userID");
            const expectedBody = { "message" : "Logged out", "status" : true };
            const res = await requester.get("/api/logout");
            expect(res).to.have.status(200);
        });
    });

     */
});