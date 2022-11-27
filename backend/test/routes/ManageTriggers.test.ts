import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Trigger from "../../src/model/Trigger";
import mongoose from "mongoose";
import Service from "../../src/model/Service";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/manage-triggers endpoint", () => {

    const endpoint = "/manage-triggers";
    let requester: ChaiHttp.Agent;
    let checkActivationStub: SinonStub;
    let checkJWTStub: SinonStub;
    let findTriggersStub: SinonStub;
    let findAllStub: SinonStub;
    let findServiceStub: SinonStub;
    let findTriggerStub: SinonStub;
    let saveStub: SinonStub;
    let deleteStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkActivationStub = sandbox.stub(Authentication, "checkActivation");
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "someUserId",
            active: true
        });
        findTriggersStub = sandbox.stub(Trigger, "findAllForService");
        findAllStub = sandbox.stub(mongoose.Model, "find");
        findServiceStub = sandbox.stub(Service, "isCreator");
        findTriggerStub = sandbox.stub(Trigger, "isCreator");
        saveStub = sandbox.stub(Trigger["model"].prototype, "save");
        deleteStub = sandbox.stub(mongoose.Model, "deleteOne");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET", function () {
        it("should call the query with the correct parameter and succeed", async () => {
            checkActivationStub.resolves(true);
            findTriggersStub.resolves([]);

            const res = await requester.get(endpoint).query({
                serviceId: "612g281261gw"
            });
            expect(res).to.have.status(200);
            expect(findTriggersStub).to.have.been.calledWith("612g281261gw");
        });

        it("should call the query without parameters and fail", async () => {
            checkActivationStub.resolves(true);
            findTriggersStub.resolves([]);

            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
            expect(findTriggersStub).to.have.not.been.called;
        });

        it("should fail when the DB throws an exception", async () => {
            checkActivationStub.resolves(true);
            findAllStub.throws();

            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
            expect(findTriggersStub).to.have.not.been.called;
        });

        it("should fail when the user is not logged in", async () => {
            checkActivationStub.resolves(false);
            checkJWTStub.throws();

            const res = await requester.get(endpoint);
            expect(res).to.have.status(500);
            expect(findTriggersStub).to.have.not.been.called;
        });

        it("should fail when the user is not logged in, v2", async () => {
            checkActivationStub.resolves(false);
            checkJWTStub.throws(new AuthError("Test Error"));

            const res = await requester.get(endpoint);
            expect(res).to.have.status(401);
            expect(findTriggersStub).to.have.not.been.called;
        });

        it("should fail when the user is not logged in, v3", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });

            const res = await requester.get(endpoint);
            expect(res).to.have.status(403);
            expect(findTriggersStub).to.have.not.been.called;
        });
    });

    describe("POST", () => {
        it("should call the query with the correct parameter and succeed", async () => {
            findServiceStub.resolves(true);
            saveStub.resolves();

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }]
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findTriggersStub.resolves([]);
            findServiceStub.resolves(true);

            const res = await requester.post(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findTriggersStub.resolves([]);
            findServiceStub.resolves(true);

            const res = await requester.post(endpoint).send({
                name: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P"
                }]
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            findServiceStub.resolves(false);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }]
            });
            expect(res).to.have.status(403);
        });

        it("should fail when the DB throws an exception", async () => {
            findServiceStub.resolves(true);
            saveStub.throws();

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }]
            });
            expect(res).to.have.status(500);
        });

        it("should fail when the user is not logged in", async () => {
            checkJWTStub.throws();

            const res = await requester.post(endpoint);
            expect(res).to.have.status(500);
        });

        it("should fail when the user is not logged in, v2", async () => {
            checkJWTStub.throws(new AuthError("Test Error"));

            const res = await requester.post(endpoint);
            expect(res).to.have.status(401);
        });
    });

    describe("DELETE", () => {
        it("should call the query with the correct parameter and succeed", async () => {
            findTriggerStub.resolves(true);
            deleteStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });

            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                triggerId: "612g281261gw"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findTriggersStub.resolves([]);
            findTriggerStub.resolves(true);

            const res = await requester.delete(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findTriggersStub.resolves([]);
            findTriggerStub.resolves(true);

            const res = await requester.delete(endpoint).send({
                serviceId: "Test"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            findTriggerStub.resolves(false);

            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                triggerId: "612g281261gw"
            });
            expect(res).to.have.status(403);
        });

        it("should fail when the DB throws an exception", async () => {
            findTriggerStub.resolves(true);
            deleteStub.throws();

            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                triggerId: "612g281261gw"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the user is not logged in", async () => {
            checkJWTStub.throws();

            const res = await requester.delete(endpoint);
            expect(res).to.have.status(500);
        });

        it("should fail when the user is not logged in, v2", async () => {
            checkJWTStub.throws(new AuthError("Test Error"));

            const res = await requester.delete(endpoint);
            expect(res).to.have.status(401);
        });
    });
});