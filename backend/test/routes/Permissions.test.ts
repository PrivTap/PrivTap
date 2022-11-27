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

describe("/permissions endpoint", () => {

    const exampleServiceId = "637e66b9d579d489c7d8ec65";
    //const exampleService : IService = {name: "Google Service", description: "A service to interact with google's APIs", creator: "161e66b9d579d489c7d8ec65", };
    //const examplePermission: IPermission = {name: "Account details permission", description: "Request access to personal account data", serviceId: "637e66b9d579d489c7d8ec65" };

    const exampleService = {} as IService;
    const examplePermission = {} as IPermission;
    const exampleDeleteRequest = {};

    let requester: ChaiHttp.Agent;
    let checkActivationStub: SinonStub;
    let checkJWTStub: SinonStub;
    let findStub: SinonStub;
    let isCreatorStub: SinonStub;
    let insertStub: SinonStub;
    let deleteStub: SinonStub;
    let updateStub: SinonStub;

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkActivationStub = sandbox.stub(Authentication, "checkActivation").resolves(true);
        checkJWTStub = sandbox.stub(Authentication, "checkJWT").returns({
            userId: "someUserId",
            active: true
        });
        findStub = sandbox.stub(Service, "find").resolves(exampleService);
        isCreatorStub = sandbox.stub(Service, "isCreator").resolves(true);
        insertStub = sandbox.stub(Permission, "insert").resolves("someNewDocumentId");
        deleteStub = sandbox.stub(Permission, "delete").resolves(true);
        updateStub = sandbox.stub(Permission, "update").resolves(true);
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
            checkActivationStub.resolves(false);
            const res = await requester.get("/permissions/").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.get("/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(401);
        });

        it ("should fail if the serviceId is not specified in the query", async () => {
            const res = await requester.get("/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the serviceId is not present in the database", async () => {
            findStub.resolves(null);
            const res = await requester.get("/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(400);
        });

        it ("should fail if the serviceId has not been created by the user", async () => {
            const res = await requester.get("/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(403);
        });

        it ("should succeed if the serviceId is present in the database and the user is the rightful, correctly authenticated, owner", async () => {
            findStub.resolves([examplePermission]);
            isCreatorStub.resolves(false);
            const res = await requester.get("/permissions").query({ serviceId: exampleServiceId });
            expect(res).to.have.status(200);
        });

    });

    describe("POST /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            checkActivationStub.resolves(false);
            const res = await requester.post("/permissions/").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the parameters are undefined", async () => {
            const res = await requester.post("/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            insertStub.resolves(null);
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.post("/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });

    describe("DELETE /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            checkActivationStub.resolves(false);
            const res = await requester.delete("/permissions/").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the parameters are undefined", async () => {
            const res = await requester.delete("/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            deleteStub.resolves(false);
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.delete("/permissions").send(exampleDeleteRequest);
            expect(res).to.have.status(200);
        });
    });

    describe("PUT /", () => {
        it ("should fail if the user is not confirmed", async () => {
            checkJWTStub.returns({
                userId: "someUserId",
                active: false
            });
            checkActivationStub.resolves(false);
            const res = await requester.put("/permissions/").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if the user doesn't have valid jwt", async () => {
            checkJWTStub.throws(new AuthError());
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(401);
        });

        it ("should fail if some of the mandatory parameters are undefined", async () => {
            const res = await requester.put("/permissions");
            expect(res).to.have.status(400);
        });

        it ("should fail if the user didn't create the specified service", async () => {
            isCreatorStub.resolves(false);
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(403);
        });

        it ("should fail if an internal error occurs", async () => {
            updateStub.resolves(false);
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(500);
        });

        it ("should succeed if the rightful creator of the service, correctly authenticated, provides all the required fields", async () => {
            const res = await requester.put("/permissions").send(examplePermission);
            expect(res).to.have.status(200);
        });
    });
});