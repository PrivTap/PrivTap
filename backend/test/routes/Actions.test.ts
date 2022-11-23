import { use, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Action from "../../src/model/Action";
import Authentication from "../../src/helper/authentication";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findActionsStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        checkJWTStub.returns("userId");
        // findActionsStub = sandbox.stub(Action, "findAllChildrenOfService");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {

        it("should fail if the user is not activated", async () => {
            //
        });

        it("should fail if the user is not authenticated");

        it("should return a list of actions for services that the user has authorized");

    });
});


