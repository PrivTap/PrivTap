import { afterEach, beforeEach, describe, test } from "vitest";
import ActionModel from "../../src/model/Action_model";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { use, expect } from "chai";
import axiosInstance from "../../src/helpers/axios_service";
import sinonChai = require("sinon-chai");
import PermissionModel from "../../src/model/permission_model";
import UserAction from "../../src/controllers/user_action";

use(sinonChai);

const sandbox = sinon.createSandbox();

describe("User Action Test", () => {
    let getStub: SinonStub;
    let postStub: SinonStub;
    let putStub: SinonStub;
    let deleteStub: SinonStub;
    let perm1: PermissionModel = new PermissionModel("perm1", "serviceId", "perm1", "desc", { detail: "details" }, true);
    let perm2: PermissionModel = new PermissionModel("perm2", "serviceId", "perm2", "desc", { detail: "details" }, true);
    const testActionModel: ActionModel = new ActionModel(
        "Test Action id",
        "Test Action name",
        "Action description",
        [perm1, perm2],
        "resourceServer",
        "[]"
    );
    const path = "/actions";
    const serviceId = "test Service id";
    const triggerId = "test Trigger id";
    let query: any;
    let headers: any;
    const config = {
        query,
        headers
    }
    beforeEach(() => {
        getStub = sandbox.stub(axiosInstance, "get");
        postStub = sandbox.stub(axiosInstance, "post");
        putStub = sandbox.stub(axiosInstance, "put");
        deleteStub = sandbox.stub(axiosInstance, "delete");
    });
    afterEach(async () => {
        sandbox.restore();
        UserAction.getRef().value = [];
        config.query = undefined;
        config.headers = undefined;
    })

    //TEST GetAllActions
    test("Should put in the ref all the Actions", async () => {
        getStub.resolves({ data: { data: [testActionModel] } })
        await UserAction.getAllActions(serviceId);

        config.query = { serviceId: serviceId };
        expect(getStub).to.have.been.calledOnceWith(path, { params: config?.query, headers: config?.headers });
        expect(UserAction.getRef().value).to.be.eql([testActionModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await UserAction.getAllActions(serviceId);

        config.query = { serviceId: serviceId };
        expect(getStub).to.have.been.calledOnceWith(path, { params: config?.query, headers: config?.headers });
        expect(UserAction.getRef().value).to.be.eql([]);
    })
    test("Should put nothing in the ref value if the gets success and valueToReturn is true", async () => {
        getStub.resolves({ data: { data: [testActionModel] } });
        const res = await UserAction.getAllActions(serviceId, true);
        config.query = { serviceId: serviceId };
        expect(UserAction.getRef().value).to.be.eql([]);
        expect(res).to.be.eql([testActionModel]);

    })
    //TEST GetAllCompatibleActions
    test("Should put in the ref all the Actions", async () => {
        getStub.resolves({ data: { data: [testActionModel] } })
        await UserAction.getCompatibleActions(serviceId, triggerId);
        config.query = { serviceId: serviceId, triggerId: triggerId };
        expect(getStub).to.have.been.calledOnceWith(path, { params: config?.query, headers: config?.headers });
        expect(UserAction.getRef().value).to.be.eql([testActionModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await UserAction.getCompatibleActions(serviceId, triggerId);
        config.query = { serviceId: serviceId, triggerId: triggerId };
        expect(getStub).to.have.been.calledOnceWith(path, { params: config?.query, headers: config?.headers });
        expect(UserAction.getRef().value).to.be.eql([]);
    })
    test("Should put nothing in the ref value if the gets success and valueToReturn is true", async () => {
        getStub.resolves({ data: { data: [testActionModel] } });
        const res = await UserAction.getCompatibleActions(serviceId, triggerId, true);
        config.query = { serviceId: serviceId, triggerId: triggerId };
        expect(getStub).to.have.been.calledOnceWith(path, { params: config?.query, headers: config?.headers });
        expect(UserAction.getRef().value).to.be.eql([]);
        expect(res).to.be.eql([testActionModel]);
    })
});

