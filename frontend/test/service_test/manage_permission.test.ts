import { afterEach, beforeEach, describe, test } from "vitest";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { use, expect } from "chai";
import axiosInstance from "../../src/helpers/axios_service";
import managePermission from "../../src/controllers/manage_Permission";
import PermissionModel from "../../src/model/Permission_model";
import sinonChai from "sinon-chai";


use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Permission Test", () => {
    let getStub: SinonStub;
    let postStub: SinonStub;
    let putStub: SinonStub;
    let deleteStub: SinonStub;
    const serviceId = "test Service id";
    const testPermissionModel: PermissionModel = new PermissionModel(
        "Test Permission id",
        serviceId,
        "Test Permission name",
        "Permission description",
        { detail: "details" },
    );

    beforeEach(() => {
        getStub = sandbox.stub(axiosInstance, "get");
        postStub = sandbox.stub(axiosInstance, "post");
        putStub = sandbox.stub(axiosInstance, "put");
        deleteStub = sandbox.stub(axiosInstance, "delete");
    });
    afterEach(async () => {
        sandbox.restore();
        managePermission.getRef().value = [];
    })

    //TEST GetPermissions
    test("Should put in the ref all the Permissions", async () => {
        getStub.resolves({ data: { data: [testPermissionModel] } })
        await managePermission.getAllPermissions(testPermissionModel.serviceId);
        expect(managePermission.getRef().value).to.be.eql([testPermissionModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await managePermission.getAllPermissions(testPermissionModel.serviceId);
        expect(managePermission.getRef().value).to.be.eql([]);
    })
    //TEST CreatePermissions
    test("Should put the created Permission in the ref array", async () => {
        postStub.resolves({ data: { data: testPermissionModel } })
        await managePermission.createPermission(testPermissionModel.serviceId, testPermissionModel.name,
            testPermissionModel.description, testPermissionModel.authorization_details)
        expect(managePermission.getRef().value).to.be.eql([testPermissionModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        postStub.resolves(null);
        await managePermission.createPermission(testPermissionModel.serviceId, testPermissionModel.name,
            testPermissionModel.description, testPermissionModel.authorization_details)

        expect(managePermission.getRef().value).to.be.eql([]);
    })

    //TEST UpdatePermission
    test("Should change the updated Permission in the ref array", async () => {
        managePermission.getRef().value = [testPermissionModel];
        const updatedPermission: PermissionModel = new PermissionModel(
            "Test Permission id",
            serviceId,
            "Test Permission name changed",
            "Permission description changed",
            { detail: "details" },
        );
        putStub.resolves({ data: { data: updatedPermission } });
        await managePermission.updatePermission(updatedPermission._id, updatedPermission.serviceId,
            updatedPermission.name, updatedPermission.description, updatedPermission.authorization_details)
        expect(managePermission.getRef().value).to.be.eql([updatedPermission]);
    })
    test("Should not change the updated Permission in the ref array if it fails", async () => {
        managePermission.getRef().value = [testPermissionModel];
        const updatedPermission: PermissionModel = new PermissionModel(
            "Test Permission id",
            serviceId,
            "Test Permission name changed",
            "Permission description changed",
            { detail: "details" },
        );
        putStub.resolves(null);
        await managePermission.updatePermission(updatedPermission.serviceId, updatedPermission._id,
            updatedPermission.name, updatedPermission.description, updatedPermission.authorization_details)
        expect(managePermission.getRef().value).to.be.eql([testPermissionModel]);

    })

    //TEST DeletePermission
    test("Should delete the Permission in the ref value", async () => {
        managePermission.getRef().value = [testPermissionModel];
        await managePermission.deletePermission(testPermissionModel.serviceId, testPermissionModel._id);
        expect(managePermission.getRef().value).to.be.eql([]);
    });

});

