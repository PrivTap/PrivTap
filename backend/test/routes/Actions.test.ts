import {use, expect, request} from "chai";
import chaiHttp = require("chai-http");
import {createSandbox, SinonStub} from "sinon";
import sinonChai = require("sinon-chai");
import {beforeEach} from "mocha";
import app from "../../src/app";
import Action from "../../src/model/Action";
import Authentication from "../../src/helper/authentication";



use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/actions endpoint", () => {

    const endpoint = "/actions";

    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findAllActionAuthorizedByUserStub: SinonStub;
    let findAllForServiceStub: SinonStub;
    const exampleServiceId = "serviceId";
    const examplePerm1 = {_id: "8380b79b38dda0d2f6be3746", name: "Service 1", desc: " Perm 1 desc"};
    const examplePerm2 = {_id: "9380b79b38dda0d2f6be3746", name: "Service 2", desc: "Perm 2 desc"};

    const exampleAction1 = {
        _id: "0380b79b38dda0d2f6be3746",
        name: "Action 1",
        description: "Action 1 desc",
        permissions: [examplePerm2, examplePerm1],
        resourceServer: "http://resource.com"
    };
    const exampleAction2 = {
        _id: "1380b79b38dda0d2f6be3746",
        name: "Action 2",
        description: "Action 2 desc",
        permissions: [examplePerm2, examplePerm1]
    };

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        findAllForServiceStub = sandbox.stub(Action, "findAllForService");
        findAllActionAuthorizedByUserStub = sandbox.stub(Action, "findAllActionAuthorizedByUser");
        checkJWTStub = sandbox.stub(Authentication, "checkJWT")
            .returns({userId: "test_user_id", active: true}); // User authenticated and account is active
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should return 400 if the service Id is not specified", async () => {
            const res = await requester.get(endpoint);
            expect(res).to.have.status(400);
        });
        it("should return all the Action with the permission populated", async () => {
            findAllForServiceStub.returns([exampleAction1, exampleAction2]);
            const res = await requester.get(endpoint).query({serviceId: exampleServiceId});
            expect(findAllForServiceStub).to.have.been.calledOnceWith(exampleServiceId);
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleAction1, exampleAction2]);
        });
        it("should return all the Action authorized with the permission populated", async () => {
            checkJWTStub.returns({userId: "test_user_id", active: true});
            findAllActionAuthorizedByUserStub.returns([exampleAction1, exampleAction2]);
            const res = await requester.get(endpoint).query({serviceId: exampleServiceId, authorized: "true"});
            expect(findAllActionAuthorizedByUserStub).to.have.been.calledOnceWith("test_user_id", exampleServiceId);
            expect(res).to.have.status(200);
            expect(res.body.data).to.be.eql([exampleAction1, exampleAction2]);
        });
        it("should fail if the user account is not active", async () => {
            checkJWTStub.returns({userId: "test_user_id", active: false});

            const res = await requester.get(endpoint);
            expect(res).to.have.status(403);
        });
        it("should give internal server error if the database fails", async () => {
            findAllForServiceStub.resolves(null);
            let res = await requester.get(endpoint).query({serviceId: exampleServiceId});
            expect(res).to.have.status(500);
            sandbox.restore();
            findAllActionAuthorizedByUserStub.resolves(null);
            checkJWTStub = sandbox.stub(Authentication, "checkJWT")
                .returns({userId: "test_user_id", active: true});
            res = await requester.get(endpoint).query({serviceId: exampleServiceId, authorized  : "true"});
            expect(res).to.have.status(500);
        });


    });
});