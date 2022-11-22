import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import Service from "../../src/model/Service";


use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/manageService endpoint", () => {
    const testUserJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdF91c2VyX2lkIiwiaWF0IjoxNjY4NzA1MTU0fQ.yHDqFZ0N_lu8v2yk20BM0B41-4suCJLVIpNhAagD_wY";
    let requester: ChaiHttp.Agent;
    let insertNewServiceStub: SinonStub;
    let findServicesCreatedByUserStub: SinonStub;
    let findServiceCreatedByUserStub: SinonStub;
    let deleteServiceStub: SinonStub;
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
        insertNewServiceStub = sandbox.stub(Service, "insert");
        findServicesCreatedByUserStub = sandbox.stub(Service, "findServicesCreatedByUser");
        findServiceCreatedByUserStub = sandbox.stub(Service, "findServiceCreatedByUser");
        deleteServiceStub = sandbox.stub(Service, "deleteService");
    });

    afterEach(() => {
        sandbox.restore();
    });
    describe("GET /", () => {

        it("should responde with services present in database", async () => {
            const serviceArray = new Array(serviceSample);
            findServicesCreatedByUserStub.resolves(serviceArray);
            const res = await requester.get("/manageServices").set("Cookie", `_jwt=${testUserJWT}`);
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
            const res = await requester.get("/manageServices").set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(500);
        });

    });
    describe("POST /", () => {

        it("should fail when the parameters are wrong", async () => {
            let res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(400);
            res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
                clientId: serviceSample.serviceSampleClientId
            });
            expect(res).to.have.status(400);
            res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({ name: serviceSample.serviceSampleName });
            expect(res).to.have.status(400);
            res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(400);
            res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: "wrongUrl",
                clientId: serviceSample.serviceSampleClientId,
                clientSecret: serviceSample.serviceSampleSecret
            });
            expect(res).to.have.status(400);
            res = await requester.post("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
            });
            expect(res).to.have.status(400);
        });

        it("should fail when inserting a duplicate user", async () => {
            insertNewServiceStub.resolves(false);
            const expectedBody = { "message": "Error while creating service", "status": false };
            const res = await requester.post("/manageServices").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc
            }).set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(400);
            expect(res.body).to.be.eql(expectedBody);
        });


        it("should succeed when all the parameters are well defined", async () => {
            insertNewServiceStub.resolves(true);
            let res = await requester.post("/manageServices").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc
            }).set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(200);
            expect(insertNewServiceStub).to.have.been.calledOnce;
            res = await requester.post("/manageServices").send({
                name: serviceSample.serviceSampleName,
                description: serviceSample.serviceSampleDesc,
                authURL: serviceSample.serviceSampleURL,
                clientId: serviceSample.serviceSampleClientId,
                clientSecret: serviceSample.serviceSampleSecret
            }).set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it("Should fail when there are wrong parameter", async () => {
            const res = await requester.delete("/manageServices").set("Cookie", `_jwt=${testUserJWT}`);
            expect(res).to.have.status(400);
        });

        it("should fail when the user can't delete the service", async () => {
            findServiceCreatedByUserStub.resolves(null);
            const res = await requester.delete("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                serviceID: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
        });
        it("Should fail when query to database fail", async () => {
            findServiceCreatedByUserStub.returns(null);
            deleteServiceStub.resolves();
            let res = await requester.delete("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                serviceID: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(403);
            findServiceCreatedByUserStub.resolves(serviceSample as Service);
            deleteServiceStub.resolves(false);
            res = await requester.delete("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                serviceID: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(500);
        });

        it("Should succeed when the parameter are correct and successfully delete the element", async () => {
            findServiceCreatedByUserStub.resolves(serviceSample as Service);
            deleteServiceStub.resolves(true);
            const res = await requester.delete("/manageServices").set("Cookie", `_jwt=${testUserJWT}`).send({
                serviceID: serviceSample.serviceSampleId
            });
            expect(res).to.have.status(200);
        });

    });
});


