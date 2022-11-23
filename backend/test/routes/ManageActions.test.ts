import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Action from "../../src/model/Action";
import mongoose from "mongoose";
import Service from "../../src/model/Service";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/manage-actions endpoint", () => {

    const endpoint = "/manage-actions";
    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findActionsStub: SinonStub;
    let findAllStub: SinonStub;
    let findServiceStub: SinonStub;
    let actionExists: SinonStub;
    let saveStub: SinonStub;
    let deleteStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        checkJWTStub.returns("612g281261gu");
        findActionsStub = sandbox.stub(Action, "findAllChildrenOfService");
        findAllStub = sandbox.stub(mongoose.Model, "find");
        findServiceStub = sandbox.stub(Service, "findServiceCreatedByUser");
        actionExists = sandbox.stub(mongoose.Model, "exists");
        saveStub = sandbox.stub(Action["actionModel"].prototype, "save");
        deleteStub = sandbox.stub(mongoose.Model, "deleteOne");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET", function () {
        it("should call the query with the correct parameter and succeed", async () => {
            findActionsStub.resolves([]);

            const res = await requester.get(endpoint).send({
                parentId: "612g281261gw"
            });
            expect(res).to.have.status(200);
            expect(findActionsStub).to.have.been.calledWith("612g281261gw");
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);

            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
            expect(findActionsStub).to.have.not.been.called;
        });

        it("should fail when the DB throws an exception", async () => {
            findAllStub.throws();

            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
            expect(findActionsStub).to.have.not.been.called;
        });

        it("should fail when the user is not logged in", async () => {
            checkJWTStub.throws();

            const res = await requester.get(endpoint);
            expect(res).to.have.status(500);
            expect(findActionsStub).to.have.not.been.called;
        });

        it("should fail when the user is not logged in, v2", async () => {
            checkJWTStub.throws(new AuthError("Test Error"));

            const res = await requester.get(endpoint);
            expect(res).to.have.status(401);
            expect(findActionsStub).to.have.not.been.called;
        });
    });

    describe("POST", () => {
        it("should call the query with the correct parameter and succeed", async () => {
            findServiceStub.resolves(true);
            actionExists.resolves(null);
            saveStub.resolves();

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                parentId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                endpoint: "https://www.end.point/api/auth"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);
            findServiceStub.resolves(true);
            actionExists.resolves(null);

            const res = await requester.post(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findActionsStub.resolves([]);
            findServiceStub.resolves(true);
            actionExists.resolves(null);

            const res = await requester.post(endpoint).send({
                name: "Test",
                parentId: "612g281261gw",
                permissions: [{
                    name: "Test P"
                }]
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            findServiceStub.resolves(false);
            actionExists.resolves(null);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                parentId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                endpoint: "https://www.end.point/api/auth"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when attempting to insert duplicates", async () => {
            findServiceStub.resolves(true);
            actionExists.resolves(true);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                parentId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                endpoint: "https://www.end.point/api/auth"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the DB throws an exception", async () => {
            findServiceStub.resolves(true);
            actionExists.resolves(null);
            saveStub.throws();

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                parentId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                endpoint: "https://www.end.point/api/auth"
            });
            expect(res).to.have.status(400);
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
            findServiceStub.resolves(true);
            actionExists.resolves(null);
            deleteStub.resolves();

            const res = await requester.delete(endpoint).send({
                serviceID: "612g281261gt",
                actionID: "612g281261gw"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);
            findServiceStub.resolves(true);
            actionExists.resolves(null);

            const res = await requester.delete(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findActionsStub.resolves([]);
            findServiceStub.resolves(true);
            actionExists.resolves(null);

            const res = await requester.delete(endpoint).send({
                serviceID: "Test"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            findServiceStub.resolves(false);
            actionExists.resolves(null);

            const res = await requester.delete(endpoint).send({
                serviceID: "612g281261gt",
                actionID: "612g281261gw"
            });
            expect(res).to.have.status(500);
        });

        it("should fail when the DB throws an exception", async () => {
            findServiceStub.resolves(true);
            actionExists.resolves(null);
            deleteStub.throws();

            const res = await requester.delete(endpoint).send({
                serviceID: "612g281261gt",
                actionID: "612g281261gw"
            });
            expect(res).to.have.status(500);
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