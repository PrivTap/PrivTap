import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Service from "../../src/model/Service";
import mongoose from "mongoose";
import Model from "../../src/Model";
import Authentication from "../../src/helper/authentication";


use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/manageService endpoint", () => {

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let insertNewServiceStub: SinonStub;
    let findServicesCreatedByUserStub: SinonStub;
    let findServiceCreatedByUserStub: SinonStub;
    let deleteServiceStub: SinonStub;
    let isCreatorStub: SinonStub;
    let updateStub: SinonStub;

    const serviceSample = {
        serviceSampleId: "637119ac77fa46cba460452d",
        serviceSampleName: "name",
        serviceSampleURL: "https://url.com",
        serviceSampleClientId: "clientId",
        serviceSampleSecret: "clientSecret",
        serviceSampleDesc: "description"
    };
    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            "userId": "UserID",
            "active": true
        });
        insertNewServiceStub = sandbox.stub(Model.prototype, "insert");
        findServicesCreatedByUserStub = sandbox.stub(Service, "findAllCreatedByUser");
        findServiceCreatedByUserStub = sandbox.stub(Service, "findById");
        deleteServiceStub = sandbox.stub(Service, "delete");
        isCreatorStub = sandbox.stub(Service, "isCreator");
        updateStub = sandbox.stub(Model.prototype, "updateWithFilter");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {

        it("should respond with services present in database", async () => {
            const serviceArray = new Array(serviceSample);
            isCreatorStub.resolves(true);
            findServicesCreatedByUserStub.resolves(serviceArray);
            const res = await requester.get("/manage-services");
            expect(res).to.have.status(200);
            const expectedObject = {
                "status": true,
                "message": "",
                "data": serviceArray
            };
            expect(res.body).to.be.eql(expectedObject);
        });

        it("should respond with internal server error if query to database fail", async () => {
            findServicesCreatedByUserStub.resolves(null);
            isCreatorStub.resolves(true);
            const res = await requester.get("/manage-services");
            expect(res).to.have.status(500);
        });

        it("should respond with the service info if we provide an ID that exists", async () => {
            isCreatorStub.resolves(true);
            findServiceCreatedByUserStub.resolves(serviceSample);
            const res = await requester.get("/manage-services").query({
                serviceId: "AServiceID"
            });
            expect(res.status).to.be.equal(200);
        });

        it("should respond with forbidden if the service ID is not owned by the user", async () => {
            isCreatorStub.resolves(false);
            findServiceCreatedByUserStub.resolves(serviceSample);
            const res = await requester.get("/manage-services").query({
                serviceId: "AServiceID"
            });
            expect(res.status).to.be.equal(403);
        });

        it("should respond with bad request if the service does not exist", async () => {
            isCreatorStub.resolves(true);
            findServiceCreatedByUserStub.resolves(null);
            const res = await requester.get("/manage-services").query({
                serviceId: "AServiceID"
            });
            expect(res.status).to.be.equal(400);
        });

    });
    describe("POST /", () => {

        it("should fail when the parameters are wrong", async () => {
            const res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: "wrongUrl",
                clientId: serviceSample.serviceSampleClientId,
                clientSecret: serviceSample.serviceSampleSecret
            });
            expect(res).to.have.status(500);
        });

        it("should fail when sending incomplete parameters", async () => {
            insertNewServiceStub.resolves(false);
            const expectedBody = { "message": "Internal server error", "status": false };
            let res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc
            });
            expect(res).to.have.status(500);
            expect(res.body).to.be.eql(expectedBody);

            res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
                clientId: serviceSample.serviceSampleClientId
            });
            expect(res).to.have.status(500);

            res = await requester.post("/manage-services").send({ name: serviceSample.serviceSampleName });
            expect(res).to.have.status(400);
            res = await requester.post("/manage-services");
            expect(res).to.have.status(400);

            res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
            });
            expect(res).to.have.status(500);
        });

        it("should succeed when all the parameters are well defined", async () => {
            insertNewServiceStub.resolves(true);
            let res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc
            });
            expect(res).to.have.status(200);
            expect(insertNewServiceStub).to.have.been.calledOnce;
            res = await requester.post("/manage-services").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
                clientId: serviceSample.serviceSampleClientId,
                clientSecret: serviceSample.serviceSampleSecret
            });
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        
        it("Should fail when there are wrong parameter", async () => {
            const res = await requester.delete("/manage-services");
            expect(res).to.have.status(400);
        });

        it("should fail when the user can't delete the service", async () => {
            isCreatorStub.resolves(null);
            const res = await requester.delete("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
        });

        it("Should fail when query to database fail", async () => {
            isCreatorStub.returns(null);
            deleteServiceStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });
            const res = await requester.delete("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
        });

        it("should fail when the query to the DB fails, v2", async () => {
            isCreatorStub.resolves(true);
            isCreatorStub.returns(true);
            deleteServiceStub.resolves(false);
            const res = await requester.delete("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(400);
        });

        it("Should succeed when the parameter are correct and successfully delete the element", async () => {
            isCreatorStub.resolves(true);
            deleteServiceStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });
            const res = await requester.delete("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(200);
        });

    });

    describe("PUT /", () => {

        it("Should fail when there are no parameter", async () => {
            const res = await requester.delete("/manage-services");
            expect(res).to.have.status(400);
        });

        it("Should fail when there are missing parameter", async () => {
            const res = await requester.delete("/manage-services").send({
                description: "Description"
            });
            expect(res).to.have.status(400);
        });

        it("should fail when the user can't update the service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.put("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
        });

        it("Should fail when query to database fail", async () => {
            isCreatorStub.returns(null);
            updateStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });
            const res = await requester.put("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
        });

        it("should fail when the query to the DB fails, v2", async () => {
            isCreatorStub.resolves(true);
            isCreatorStub.returns(true);
            deleteServiceStub.resolves(false);
            const res = await requester.put("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(400);
        });

        it("Should succeed when the parameter are correct and successfully delete the element", async () => {
            isCreatorStub.resolves(true);
            deleteServiceStub.resolves({
                n: 1,
                ok: true,
                deletedCount: 1
            });
            const res = await requester.delete("/manage-services").send({
                serviceId: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(200);
        });

    });
});