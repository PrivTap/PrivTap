import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import User from "../../src/model/User";
import bcrypt from "bcrypt";
import LoginRoute from "../../src/routes/shared/Login";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/register endpoint", () => {

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
        queryUserStub = sandbox.stub(User, "queryUser");
        compareSyncStub = sandbox.stub(bcrypt, "compareSync");
        setAuthenticationCookieStub = sandbox.stub(LoginRoute, <any> "setAuthenticationCookie");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {

        it("should fail when either the username or password are undefined", async () => {
            const expectedBody = { "message" : "Undefined parameters", "status" : false };
            const resNoUser = await requester.post("/login").send({
                password: "somePassword"
            });
            const resNoPw = await requester.post("/login").send({
                username : "someUsername",
            });
            expect(resNoUser).to.have.status(400);
            expect(resNoUser.body).to.be.eql(expectedBody);

            expect(resNoPw).to.have.status(400);
            expect(resNoPw.body).to.be.eql(expectedBody);
        });

        it("should fail when the DB query fails", async () => {
            queryUserStub.throws();
            const expectedBody = { "message" : "Internal server error", "status" : false };
            const res = await requester.post("/login").send({
                username : "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(500);
            expect(res.body).to.be.eql(expectedBody);
        });

        it("should fail when the query produces no result", async () => {
            queryUserStub.resolves(null);
            const expectedBody = { "message" : "Wrong credentials", "status" : false };
            const res = await requester.post("/login").send({
                username : "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
            expect(res.body).to.be.eql(expectedBody);
        });


        // NOT WORKING
        // Bypass compareSync stub
        it("should fail if the password is not correct", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(false);
            setAuthenticationCookieStub.returns(true);
            const expectedBody = { "message" : "Wrong credentials", "status" : false };
            const res = await requester.post("/login").send({
                username : "someUsername",
                password: "somePassword"
            });
            console.log(res.body);
            expect(res).to.have.status(400);
            expect(res.body).to.be.eql(expectedBody);
        });

        it("should fail if the authentication cookie is not properly set", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(true);
            setAuthenticationCookieStub.returns(false);
            const expectedBody = { "message" : "Internal server error", "status" : false };
            const res = await requester.post("/login").send({
                username : "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(500);
            expect(res.body).to.be.eql(expectedBody);
        });

        it("should succeed if the credentials are correct", async () => {
            queryUserStub.resolves("username");
            compareSyncStub.returns(true);
            setAuthenticationCookieStub.returns(true);
            const credentials = { "username": "someUsername" };
            const expectedBody = { "data" : credentials, "message" : "", "status" : true };

            const res = await requester.post("/api/login").send({
                username : "someUsername",
                password: "somePassword"
            });
            expect(res).to.have.status(200);
            expect(res.body).to.be.eql(expectedBody);
        });
    });
});