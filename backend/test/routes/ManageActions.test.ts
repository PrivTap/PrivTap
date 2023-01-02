import {use, expect, request} from "chai";
import chaiHttp = require("chai-http");
import {createSandbox, SinonStub} from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, {AuthError} from "../../src/helper/authentication";
import Action from "../../src/model/Action";
import mongoose from "mongoose";
import Model from "../../src/Model";
import Service from "../../src/model/Service";
import {beforeEach} from "mocha";
import * as dataDefinition from "../../src/helper/dataDefinition";
import {transformStringInDataDef} from "../../src/helper/dataDefinition";
import Permissions from "../../src/model/Permission"

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/manage-actions endpoint", () => {

    const endpoint = "/manage-actions";
    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findActionsStub: SinonStub;
    let findAllStub: SinonStub;
    let isCreator: SinonStub;
    let isServiceCreator: SinonStub;
    let saveStub: SinonStub;
    let deleteStub: SinonStub;
    let transformStringInDataDefStub: SinonStub;
    let getAllPermissionAndAddBooleanTagStub: SinonStub;
    let updateStub: SinonStub;
    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        checkJWTStub.returns({
            userId: "612g281261gu",
            active: true
        });
        findActionsStub = sandbox.stub(Action, "findAllForService");
        findAllStub = sandbox.stub(mongoose.Model, "find");
        isCreator = sandbox.stub(Action, "isCreator").resolves(true);
        isServiceCreator = sandbox.stub(Service, "isCreator");
        saveStub = sandbox.stub(Model.prototype, "insertAndReturn");
        deleteStub = sandbox.stub(mongoose.Model, "deleteOne");
        transformStringInDataDefStub = sandbox.stub(dataDefinition, "transformStringInDataDef");
        getAllPermissionAndAddBooleanTagStub = sandbox.stub(Permissions, "getAllPermissionAndAddBooleanTag").resolves([{
            name: "test",
            description: "test",
        }])
        updateStub =sandbox.stub(Model.prototype, "updateWithFilterAndReturn");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET", function () {
        it("should call the query with the correct parameter and succeed", async () => {
            findActionsStub.resolves([]);

            const res = await requester.get(endpoint).query({
                serviceId: "612g281261gw"
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
            isServiceCreator.resolves(true);
            saveStub.resolves(true);
            transformStringInDataDefStub.returns("{trigger_data:[{type: 'text' ,identifier: 'title'}])}");
            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: ["612g281261gw"],
                inputs: "[{type: text ,identifier: 'title'}]",
                endpoint: "https:www.end.point/api/auth"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);
            isServiceCreator.resolves(true);

            const res = await requester.post(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findActionsStub.resolves([]);
            isServiceCreator.resolves(true);

            const res = await requester.post(endpoint).send({
                name: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P"
                }],
                inputs: "{trigger_data: [{type: DataType.Text,identifier: 'title'}]}", // This is not valid JSON
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            isServiceCreator.resolves(false);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                endpoint: "https:www.end.point/api/auth",
                inputs: "[{type: text ,identifier: 'title'}]",

            });
            expect(res).to.have.status(403);
        });

        it("should fail when attempting to insert duplicates", async () => {
            isServiceCreator.resolves(true);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                inputs: "[{type: text ,identifier: 'title'}]",
                endpoint: "https:www.end.point/api/auth"
            });
            expect(res).to.have.status(500);
        });

        it("should fail when the DB throws an exception", async () => {
            isServiceCreator.resolves(true);
            saveStub.resolves(false);

            const res = await requester.post(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                inputs: "[{type: text ,identifier: 'title'}]",
                endpoint: "https:www.end.point/api/auth"
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
            isCreator.resolves(true);
            deleteStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });

            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                actionId: "612g281261gw"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);
            isCreator.resolves(true);

            const res = await requester.delete(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findActionsStub.resolves([]);
            isCreator.resolves(true);

            const res = await requester.delete(endpoint).send({
                serviceId: "Test"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            isCreator.resolves(false);
            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                actionId: "612g281261gw"
            });
            expect(res).to.have.status(403);
        });

        it("should fail when the DB throws an exception", async () => {
            isCreator.resolves(true);
            deleteStub.throws();

            const res = await requester.delete(endpoint).send({
                serviceId: "612g281261gt",
                actionId: "612g281261gw"
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
    describe("PUT", () => {
        it("should call the query with the correct parameter and succeed", async () => {
            isServiceCreator.resolves(true);
            updateStub.resolves(true);
            transformStringInDataDefStub.returns("{trigger_data:[{type: 'text' ,identifier: 'title'}])}");
            const res = await requester.put(endpoint).send({
                name: "Test",
                actionId: "612g281261gw",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: ["612g281261gw"],
                inputs: "[{type: text ,identifier: 'title'}]",
                endpoint: "https:www.end.point/api/auth"
            });
            expect(res).to.have.status(200);
        });

        it("should call the query without parameters and fail", async () => {
            findActionsStub.resolves([]);
            isServiceCreator.resolves(true);

            const res = await requester.put(endpoint);
            expect(res).to.have.status(400);
        });

        it("should call the query with some parameters and fail", async () => {
            findActionsStub.resolves([]);
            isServiceCreator.resolves(true);

            const res = await requester.put(endpoint).send({
                name: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P"
                }],
                inputs: "{trigger_data: [{type: DataType.Text,identifier: 'title'}]}", // This is not valid JSON
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the User is not owner of the service", async () => {
            isServiceCreator.resolves(false);
            isCreator.resolves(false);
            const res = await requester.put(endpoint).send({
                name: "Test",
                description: "Test",
                serviceId: "612g281261gw",
                permissions: [{
                    name: "Test P",
                    scope: "Scope"
                }],
                actionId: "612g281261gw",
                endpoint: "https:www.end.point/api/auth",
                inputs: "[{type: text ,identifier: 'title'}]",

            });
            expect(res).to.have.status(403);
        });


        it("should fail when the user is not logged in, v2", async () => {
            checkJWTStub.throws(new AuthError("Test Error"));

            const res = await requester.post(endpoint);
            expect(res).to.have.status(401);
        });
    });
});