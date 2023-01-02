import { afterEach, beforeEach, describe, test } from "vitest";
import TriggerModel from "../../src/model/trigger_model";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { use, expect } from "chai";
import axiosInstance from "../../src/helpers/axios_service";
import sinonChai = require("sinon-chai");
import PermissionModel from "../../src/model/permission_model";
import UserTrigger from "../../src/controllers/user_trigger";


use(sinonChai);

const sandbox = sinon.createSandbox();

describe("User Trigger Test", () => {
    let getStub: SinonStub;
    let postStub: SinonStub;
    let putStub: SinonStub;
    let deleteStub: SinonStub;
    let perm1: PermissionModel = new PermissionModel("perm1", "serviceId", "perm1", "desc", { detail: "details" }, true);
    let perm2: PermissionModel = new PermissionModel("perm2", "serviceId", "perm2", "desc", { detail: "details" }, true);
    const testTriggerModel: TriggerModel = new TriggerModel(
        "Test Trigger id",
        "Test Trigger name",
        "Trigger description",
        [perm1, perm2],
        "[]",
        "resourceServer",
    );
    const serviceId = "test Service id";
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
        UserTrigger.getRef().value = [];
        config.query = undefined;
        config.headers = undefined;
    })

    //TEST GetAllTriggers
    test("Should put in the ref all the triggers", async () => {
        getStub.resolves({ data: { data: [testTriggerModel] } })
        await UserTrigger.getAllTriggers(serviceId);

        config.query = { serviceId: serviceId };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([testTriggerModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await UserTrigger.getAllTriggers(serviceId);

        config.query = { serviceId: serviceId };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([]);
    })
    test("Should put nothing in the ref value if the gets success and valueToReturn is true", async () => {
        getStub.resolves({ data: { data: [testTriggerModel] } });
        const res = await UserTrigger.getAllTriggers(serviceId, true);
        config.query = { serviceId: serviceId };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([]);
        expect(res).to.be.eql([testTriggerModel]);

    })
    //TEST GetAllAuthorizedTriggers
    test("Should put in the ref all the triggers", async () => {
        getStub.resolves({ data: { data: [testTriggerModel] } })
        await UserTrigger.getAllTriggers(serviceId);
        config.query = { serviceId: serviceId, authorized: true };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([testTriggerModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await UserTrigger.getAllTriggers(serviceId);
        config.query = { serviceId: serviceId, authorized: true };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([]);
    })
    test("Should put nothing in the ref value if the gets success and valueToReturn is true", async () => {
        getStub.resolves({ data: { data: [testTriggerModel] } });
        const res = await UserTrigger.getAllTriggers(serviceId, true);
        config.query = { serviceId: serviceId, authorized: true };
        expect(getStub).to.have.been.calledOnceWith("/triggers", { params: config?.query, headers: config?.headers });
        expect(UserTrigger.getRef().value).to.be.eql([]);
        expect(res).to.be.eql([testTriggerModel]);

    })
});

