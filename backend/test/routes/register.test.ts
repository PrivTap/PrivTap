import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub, fake } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import User from "../../src/model/User";
import { sendRegistrationEmail } from "../../src/helper/mailer";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/register endpoint", () => {

    let requester: ChaiHttp.Agent;
    let insertNewUserStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        insertNewUserStub = sandbox.stub(User, "insertNewUser");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("POST /", () => {

        it("should fail when the password is too short", async () => {
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "shortPW"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when data checks fail", async () => {
            insertNewUserStub.throws("ValidationError");
            const expectedBody = { "message" : "Bad request", "status" : false };
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
            expect(res.body).to.be.eql(expectedBody);
        });

        it("should fail when the username/email is already in the DB", async () => {
            insertNewUserStub.throws("MongoServerError");
            const expectedBody = { "message" : "Username or email taken", "status" : false };
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
            expect(res.body).to.be.eql(expectedBody);
        });

        it ("should succeed when all the parameters are well defined", async () => {
            insertNewUserStub.resolves(true);
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(200);
        });


        // TODO: Make mailer module in
/*
        it ("should fail if the mailing process fails", async () => {
            insertNewUserStub.resolves(true);
            const res = await requester.post("/api/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(500);
        });
        */
    });
});