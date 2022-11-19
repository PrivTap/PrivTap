import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import User from "../../src/model/User";
import Mailer from "../../src/helper/mailer";
import ModelError from "../../src/model/ModelError";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/register endpoint", () => {

    let requester: ChaiHttp.Agent;
    let insertNewUserStub: SinonStub;
    let sendRegistrationEmailStub: SinonStub;

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

        it ("should fail if the mailing process fails", async () => {
            insertNewUserStub.resolves(true);
            sendRegistrationEmailStub = sandbox.stub(Mailer, "sendRegistrationEmail");
            sendRegistrationEmailStub.throws();
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(500);
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
    });
});