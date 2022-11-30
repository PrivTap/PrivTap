import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import Authentication, { AuthError } from "../../src/helper/authentication";
import Permission, { IPermission } from "../../src/model/Permission";
import Service, { IService } from "../../src/model/Service";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/api/permissions endpoint", () => {

    const exampleServiceId = "637e66b9d579d489c7d8ec65";

    const examplePermission = {
        permissionId: "aa7f16b9d579d489c7d8ec65",
        name: "permissionName",
        description: "permissionDescription",
        serviceId: "567f16b9d579d489c7d8ec65",
        rarObject: {}
    };

    const exampleDeleteRequest = { serviceId: exampleServiceId, permissionId: "6a71f6b9d579d489c7d8ec65" };

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findByIdStub: SinonStub;
    let isCreatorStub: SinonStub;
    let insertAndReturnStub: SinonStub;
    let belongsToServiceStub: SinonStub;
    let deleteStub: SinonStub;
    let updateWithFilterAndReturnStub: SinonStub;
    let findByServiceIdStub: SinonStub;

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
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(401);
        });

        it ("should fail if the serviceId is not specified in the query", async () => {
            const res = await requester.get("/api/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the serviceId is not present in the database", async () => {
            findByIdStub.resolves(null);
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(400);
        });

        it ("should fail if the serviceId has not been created by the user", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            findByServiceIdStub.resolves(null);
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(500);
        });

        it ("should succeed if the serviceId is present in the database and the user is the rightful, correctly authenticated, owner", async () => {
            const res = await requester.get("/api/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(200);
        });

    });

    describe("POST /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.post("/api/permissions/").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.post("/api/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the parameters are undefined", async () => {
            const res = await requester.post("/api/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the serviceId is not present in the database", async () => {
            findByIdStub.resolves(null);
            const res = await requester.post("/api/permissions").send(examplePermission);
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.post("/api/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            insertAndReturnStub.resolves(null);
            const res = await requester.post("/api/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.post("/api/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.delete("/api/permissions/").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.delete("/api/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the parameters are undefined", async () => {
            const res = await requester.delete("/api/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.delete("/api/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it ("should fail if the specified permission doesn't belong to the right service", async () => {
            belongsToServiceStub.resolves(false);
            const res = await requester.delete("/api/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });


        it ("should fail if an internal error occurs", async () => {
            deleteStub.resolves(false);
            const res = await requester.delete("/api/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.delete("/api/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(200);
        });
    });

    describe("PUT /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the mandatory parameters are undefined", async () => {
            const res = await requester.put("/api/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if the specified permission doesn't belong to the right service", async () => {
            belongsToServiceStub.resolves(false);
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            updateWithFilterAndReturnStub.throws();
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.put("/api/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });
});