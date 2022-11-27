import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import User from "../../src/model/User";
import Mailer from "../../src/helper/mailer";
import { ModelSaveError } from "../../src/Model";
import Logger from "../../src/helper/logger";
import { beforeEach } from "mocha";

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

    function stubLogger() {
        sandbox.stub(Logger, "error").resolves();
        sandbox.stub(Logger, "info").resolves();
        sandbox.stub(Logger, "debug").resolves();
        sandbox.stub(Logger, "warn").resolves();
        sandbox.stub(Logger, "log").resolves();
        sandbox.stub(Logger, "trace").resolves();
        sandbox.stub(Logger, "fatal").resolves();
    }

    beforeEach(() => {
        stubLogger();
        insertNewUserStub = sandbox.stub(User, "insert");
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

        it("should fail when data checks fails", async () => {
            insertNewUserStub.throws(new ModelSaveError("", undefined));
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the username/email is already in the DB", async () => {
            insertNewUserStub.throws(new ModelSaveError("", undefined));
            const res = await requester.post("/register").send({
                username : "someUsername",
                email: "someEmail@gmail.com",
                password: "somePassword"
            });
            expect(res).to.have.status(400);
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