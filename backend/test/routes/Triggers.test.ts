import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Trigger from "../../src/model/Trigger";
import mongoose from "mongoose";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/triggers endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findTriggersStub: SinonStub;
    let findAllStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        checkJWTStub.returns("userID");
        // findTriggersStub = sandbox.stub(Trigger, "findAllChildrenOfService");
        findAllStub = sandbox.stub(mongoose.Model, "find");
    });

    afterEach(() => {
        sandbox.restore();
    });


});


