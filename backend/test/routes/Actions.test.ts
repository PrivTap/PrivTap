import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import mongoose from "mongoose";
import Action from "../../src/model/Action";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findActionsStub: SinonStub;
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
        findActionsStub = sandbox.stub(Action, "findAllChildrenOfService");
        findAllStub = sandbox.stub(mongoose.Model, "find");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should call the query with the correct parameter and succeed", async () => {
        findActionsStub.resolves([]);

        const res = await requester.get("/actions").send({
            parentId: "612g281261gw"
        });
        expect(res).to.have.status(200);
        expect(findActionsStub).to.have.been.calledWith("612g281261gw");
    });

    it("should call the query without parameters and fail", async () => {
        findActionsStub.resolves([]);

        const res = await requester.get("/actions");
        expect(res).to.have.status(400);
        expect(findActionsStub).to.have.not.been.called;
    });

    it("should fail when the DB throws an exception", async () => {
        findAllStub.throws();

        const res = await requester.get("/actions");
        expect(res).to.have.status(400);
        expect(findActionsStub).to.have.not.been.called;
    });

    it("should fail when the user is not logged in", async () => {
        checkJWTStub.throws();

        const res = await requester.get("/actions");
        expect(res).to.have.status(500);
        expect(findActionsStub).to.have.not.been.called;
    });

    it("should fail when the user is not logged in, v2", async () => {
        checkJWTStub.throws(new AuthError("Test Error"));

        const res = await requester.get("/actions");
        expect(res).to.have.status(401);
        expect(findActionsStub).to.have.not.been.called;
    });
});


