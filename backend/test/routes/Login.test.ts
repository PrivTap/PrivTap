import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import User from "../../src/model/User";
import bcrypt = require( "bcrypt");
import Authentication from "../../src/helper/authentication";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/login endpoint", () => {

    let requester: ChaiHttp.Agent;
    let queryUserStub: SinonStub;
    let compareSyncStub: SinonStub;
    let setAuthenticationCookieStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        queryUserStub = sandbox.stub(User, "findByUsername");
        compareSyncStub = sandbox.stub(bcrypt, "compareSync");
        setAuthenticationCookieStub = sandbox.stub(Authentication, "setAuthenticationCookie");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {

        it("should fail when either the username or password are undefined", async () => {
            const resNoUser = await requester.post("/login").send({
                password: "somePassword"
            });
            const resNoPw = await requester.post("/login").send({
                username: "someUsername",
            });
            expect(resNoUser).to.have.status(400);
            expect(resNoPw).to.have.status(400);
        });

        it("should fail when the query produces no result", async () => {
            queryUserStub.resolves(null);
            const res = await requester.post("/login").send({
                username: "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
        });


        // NOT WORKING
        // Bypass compareSync stub
        it("should fail if the password is not correct", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(false);
            setAuthenticationCookieStub.returns(true);
            const res = await requester.post("/login").send({
                username: "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
        });

        it("should fail if the authentication cookie is not properly set", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(true);
            setAuthenticationCookieStub.returns(false);
            const res = await requester.post("/login").send({
                username: "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(500);
        });

        it("should succeed if the credentials are correct", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(true);
            setAuthenticationCookieStub.returns(true);
            const credentials = { "username": "someUsername" };
            const expectedBody = { "data": credentials, "message": "", "status": true };

            const res = await requester.post("/login").send({
                username: "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(200);
            expect(res.body).to.be.eql(expectedBody);
        });
    });
});