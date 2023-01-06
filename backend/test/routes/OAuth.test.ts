import {use, expect, request} from "chai";
import chaiHttp = require("chai-http");
import {createSandbox, SinonStub} from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication from "../../src/helper/authentication";
import * as OAuth from "../../src/helper/oauth";
import State from "../../src/model/State";
import * as misc from "../../src/helper/misc";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/OAUTH endpoint", () => {
    const exampleState = {
        _id: "aa7f16b9d579d489c7d8ec65",
        userId: "someUserId",
        serviceId: "567f16b9d579d489c7d8ec65",
        value : "someStateValue",
        permissionId: Array<string>()
    }

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findByValueStub: SinonStub;
    let deleteStub: SinonStub;
    let tokenStub: SinonStub;
    let updateStub: SinonStub;
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
        findByValueStub = sandbox.stub(State, "findByValue").resolves(exampleState);
        deleteStub = sandbox.stub(State, "delete");
        tokenStub = sandbox.stub(OAuth.default, "retrieveToken");
        updateStub = sandbox.stub(misc, "handleUpdate").resolves(true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should fail if there is no state in db", async () => {
            findByValueStub.resolves(null)
            const res = await requester.get("/oauth").query({code: 123, state: 123});
            expect(res).to.have.status(400);
        });
        it("should fail if the user id of the state is different from the jwt userId", async () => {
            findByValueStub.resolves(null)
            const res = await requester.get("/oauth").query({code: 123, state: 123});
            expect(res).to.have.status(400);
        });

        it("should fail if there is no token", async () => {
            findByValueStub.resolves(exampleState)
            deleteStub.resolves(true);
            tokenStub.resolves(null);
            const res = await requester.get("/oauth").query({code: 123, state: 123});
            expect(res).to.have.status(400);
        });
        it("should succeed", async () => {
            findByValueStub.resolves(exampleState)
            deleteStub.resolves(true);
            tokenStub.resolves(true);
            const res = await requester.get("/oauth").query({code: 123, state: 123});
            expect(findByValueStub).to.have.been.calledOnce;
            expect(res).to.have.status(200);
        });
    });
});