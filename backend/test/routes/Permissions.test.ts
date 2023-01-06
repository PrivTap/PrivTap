import {use, expect, request} from "chai";
import chaiHttp = require("chai-http");
import {createSandbox, SinonStub} from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import Authentication, {AuthError} from "../../src/helper/authentication";
import Permission, {IPermission} from "../../src/model/Permission";
import Service, {IService} from "../../src/model/Service";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/permissions endpoint", () => {

    const exampleServiceId = "637e66b9d579d489c7d8ec65";
    const exampleService: IService = {
        _id: exampleServiceId,
        name: "Example Service",
        description: "This is an example service",
        creator: "637e66b9d579d489c7d8ec65",
        authPath: "https://example.com/auth",
        authServer: "https://example.com",
        tokenPath: "https://example.com/token",
        baseUrl: "https://example.com",
        clientId: "exampleClientId",
        clientSecret: "exampleClientSecret",
        triggerNotificationServer: "https://example.com/trigger",
        apiKey: "example"
    }
    const examplePermission = {
        permissionId: "aa7f16b9d579d489c7d8ec65",
        name: "permissionName",
        description: "permissionDescription",
        serviceId: "567f16b9d579d489c7d8ec65",
        authorization_details: {}
    };

    const exampleDeleteRequest = {serviceId: exampleServiceId, permissionId: "6a71f6b9d579d489c7d8ec65"};

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findByIdStub: SinonStub;
    let isCreatorStub: SinonStub;
    let insertAndReturnStub: SinonStub;
    let belongsToServiceStub: SinonStub;
    let deleteStub: SinonStub;
    let updateWithFilterAndReturnStub: SinonStub;
    let findByServiceIdStub: SinonStub;
    let findServiceStub: SinonStub;
    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "someUserId",
            active: true
        });
        findServiceStub = sandbox.stub(Service, "find")
        findByIdStub = sandbox.stub(Service, "findById").resolves({} as IService);
        isCreatorStub = sandbox.stub(Service, "isCreator").resolves(true);
        insertAndReturnStub = sandbox.stub(Permission, "insertAndReturn").resolves({} as IPermission);
        belongsToServiceStub = sandbox.stub(Permission, "belongsToService").resolves(true);
        deleteStub = sandbox.stub(Permission, "delete").resolves(true);
        updateWithFilterAndReturnStub = sandbox.stub(Permission, "updateWithFilterAndReturn").resolves({} as IPermission);
        findByServiceIdStub = sandbox.stub(Permission, "findByServiceId").resolves([{}] as IPermission[]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.get("/permissions").query({serviceId: exampleServiceId});
            expect(res).to.have.status(403);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/permissions").query({serviceId: exampleServiceId});
            expect(res).to.have.status(401);
        });

        it("should fail if the serviceId is not specified in the query", async () => {
            const res = await requester.get("/permissions");
            expect(res).to.have.status(400);
        });

        it("should fail if the serviceId is not present in the database", async () => {
            findByIdStub.resolves(null);
            const res = await requester.get("/permissions").query({serviceId: exampleServiceId});
            expect(res).to.have.status(400);
        });

        it("should fail if an internal error occurs", async () => {
            findByServiceIdStub.resolves(null);
            const res = await requester.get("/permissions").query({serviceId: exampleServiceId});
            expect(res).to.have.status(500);
        });

        it("should succeed if the serviceId is present in the database and the user is the rightful, correctly authenticated, owner", async () => {
            const res = await requester.get("/permissions").query({serviceId: exampleServiceId});
            expect(res).to.have.status(200);
        });

    });

    describe("POST /", () => {
        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.post("/permissions/").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.post("/permissions");
            expect(res).to.have.status(400);
        });

        it("should fail if the serviceId is not present in the database", async () => {
            findByIdStub.resolves(null);
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(400);
        });

        it("should fail if the user didn't create the specified service", async () => {
            findServiceStub.resolves(null)
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });
        it("should fail if there is no path for auth", async () => {
            findServiceStub.resolves({authPath: null})
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(400);
        })
        it("should fail if an internal error occurs", async () => {
            insertAndReturnStub.resolves(null);
            findServiceStub.resolves(exampleService)
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it("should succeed if an internal error occurs", async () => {
            insertAndReturnStub.resolves(true);
            findServiceStub.resolves(exampleService)
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.delete("/permissions/").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(401);
        });

        it("should fail if some of the parameters are undefined", async () => {
            const res = await requester.delete("/permissions");
            expect(res).to.have.status(400);
        });
        it("should fail if there is no service", async () => {
            findByIdStub.resolves(null)
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(400);
        });
        it("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it("should fail if the specified permission doesn't belong to the right service", async () => {
            belongsToServiceStub.resolves(false);
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });


        it("should fail if an internal error occurs", async () => {
            deleteStub.resolves(false);
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(500);
        });

        it("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(200);
        });
    });

    describe("PUT /", () => {
        it("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });
        it("should fail if there is no service", async () => {
            findByIdStub.resolves(null)
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(400);
        });
        it("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it("should fail if some of the mandatory parameters are undefined", async () => {
            const res = await requester.put("/permissions");
            expect(res).to.have.status(400);
        });

        it("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it("should fail if the specified permission doesn't belong to the right service", async () => {
            belongsToServiceStub.resolves(false);
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it("should fail if an internal error occurs", async () => {
            updateWithFilterAndReturnStub.throws();
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });
});