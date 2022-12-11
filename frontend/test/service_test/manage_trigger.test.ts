import {afterEach, beforeEach, describe, test} from "vitest";
import manageTrigger from "../../src/controllers/manage_trigger";
import TriggerModel from "../../src/model/trigger_model";
import {SinonStub} from "sinon";
import * as sinon from "sinon";
import {use, expect} from "chai";
import sinonChai = require("sinon-chai");
import axiosInstance from "../../src/helpers/axios_service";


use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Trigger Test", () => {
    let getStub: SinonStub;
    let postStub: SinonStub;
    let putStub: SinonStub;
    let deleteStub: SinonStub;
    const testTriggerModel: TriggerModel = new TriggerModel(
        "Test Trigger id",
        "Test Trigger name",
        "Trigger description",
        ["String1", "String2"],
    );
    const serviceId = "test Service id";
    beforeEach(() => {
        getStub = sandbox.stub(axiosInstance, "get");
        postStub = sandbox.stub(axiosInstance, "post");
        putStub = sandbox.stub(axiosInstance, "put");
        deleteStub = sandbox.stub(axiosInstance, "delete");
    });
    afterEach(async () => {
        sandbox.restore();
        manageTrigger.getRef().value=[];
    })

    //TEST GetTriggers
    test("Should put in the ref all the triggers", async () => {
        getStub.resolves({data: {data: [testTriggerModel]}})
        await manageTrigger.getAllTriggers(testTriggerModel.serviceId);
        expect(manageTrigger.getRef().value).to.be.eql([testTriggerModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async()=>{
        getStub.resolves(null);
        await manageTrigger.getAllTriggers(testTriggerModel.serviceId);
        expect(manageTrigger.getRef().value).to.be.eql([]);
    })

    //TEST CreateTriggers
    test("Should put the created trigger in the ref array", async () => {
        postStub.resolves({data: {data: testTriggerModel}})
        await manageTrigger.createTrigger(testTriggerModel.name, testTriggerModel.description,
            serviceId, testTriggerModel.permissions)
        expect(manageTrigger.getRef().value).to.be.eql([testTriggerModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async()=>{
        postStub.resolves(null);
        await manageTrigger.createTrigger(testTriggerModel.name, testTriggerModel.description,
            serviceId, testTriggerModel.permissions)
        expect(manageTrigger.getRef().value).to.be.eql([]);
    })

    //TEST UpdateTrigger
    test("Should change the updated trigger in the ref array", async()=>{
        manageTrigger.getRef().value= [testTriggerModel];
        const updatedTrigger= new TriggerModel(
            "Test Trigger id",
            "Test Trigger name changed",
            "Trigger description changed",
            ["String1", "String2", "added String"],
        )
        putStub.resolves({data: {data:updatedTrigger}});
        await manageTrigger.updateTrigger(updatedTrigger._id, updatedTrigger.name, updatedTrigger.description,
            updatedTrigger.permissions, updatedTrigger.resourceServer)
        expect(manageTrigger.getRef().value).to.be.eql([updatedTrigger]);
    })
    test("Should not change the updated trigger in the ref array if it fails", async()=>{
        manageTrigger.getRef().value= [testTriggerModel];
        const updatedTrigger= new TriggerModel(
            "Test Trigger id",
            "Test Trigger name changed",
            "Trigger description changed",
            ["String1", "String2", "added String"],
        )
        putStub.resolves(null);
        await manageTrigger.updateTrigger(updatedTrigger._id, updatedTrigger.name, updatedTrigger.description,
            updatedTrigger.permissions, updatedTrigger.resourceServer)
        expect(manageTrigger.getRef().value).to.be.eql([testTriggerModel]);

    })

    //TEST DeleteTrigger
    test("Should delete the trigger in the ref value", async () => {
        manageTrigger.getRef().value= [testTriggerModel];
        await manageTrigger.deleteTrigger(testTriggerModel._id);
        expect(manageTrigger.getRef().value).to.be.eql([]);
    });

});
