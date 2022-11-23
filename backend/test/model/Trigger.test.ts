import { expect } from "chai";

import "../../src/app";
import mongoose from "mongoose";
import Trigger from "../../src/model/Trigger";
import { beforeEach } from "mocha";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { Permission } from "../../src/model/Permission";



const sandbox = sinon.createSandbox();

describe("Testing the Trigger model class", () => {

    let existStub: SinonStub;
    let findStub: SinonStub;
    let findOneStub: SinonStub;
    let deleteOneStub: SinonStub;
    let saveStub: SinonStub;

    beforeEach(() => {
        existStub = sandbox.stub(mongoose.Model, "exists");
        findStub = sandbox.stub(mongoose.Model, "find");
        findOneStub = sandbox.stub(mongoose.Model, "findOne");
        deleteOneStub = sandbox.stub(mongoose.Model, "deleteOne");
        saveStub = sandbox.stub(Trigger["triggerModel"].prototype, "save");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("should create a new trigger", async () => {
        existStub.resolves(null);
        saveStub.resolves();
        findOneStub.resolves(true);

        expect(await Trigger.insert("Test", "Test", "612g281261gw", "612g281261ga", [new Permission("Scope", "Name")])).to.be.true;
    });

    it("should not create a duplicate trigger", async () => {
        existStub.resolves({ _id: "Something" });
        saveStub.resolves();
        findOneStub.resolves(true);

        expect(await Trigger.insert("Test", "Test", "612g281261gw", "612g281261ga", [new Permission("Scope", "Name")])).to.be.false;
    });

    it("should not create a service if the save method fails", async () => {
        existStub.resolves(null);
        saveStub.throws();
        findOneStub.resolves(true);

        expect(await Trigger.insert("Test", "Test", "612g281261gw", "612g281261ga", [new Permission("Scope", "Name")])).to.be.false;
    });

    it("should not create a trigger when the parent service is not owned by the user",  async () => {
        existStub.resolves(null);
        saveStub.resolves();
        findOneStub.resolves(false);

        expect(await Trigger.insert("Test", "Test", "612g281261gw", "612g281261ga", [new Permission("Scope", "Name")])).to.be.false;
    });

    it("should delete a trigger owned by the user", async () => {
        findOneStub.resolves(true);
        deleteOneStub.resolves();

        expect(await Trigger.delete("612g281261gw", "612g281261ga", "612g281261gc")).to.be.true;
    });

    it("should not delete a trigger that is not owned by the user", async () => {
        findOneStub.resolves(false);
        deleteOneStub.resolves();

        expect(await Trigger.delete("612g281261gw", "612g281261ga", "612g281261gc")).to.be.false;
    });

    it("should not delete the trigger if the method fails", async () => {
        findOneStub.resolves(true);
        deleteOneStub.throws();

        expect(await Trigger.delete("612g281261gw", "612g281261ga", "612g281261gc")).to.be.false;
    });

    it("should find all children of a service owned by the user", async () => {
        const queryResult = [{
            _id: "612g281261gw",
            name: "Test 1",
            description: "Description 1",
            serviceId: "612g281261gw",
            permissions: [
                {
                    _id: "612g281261aw",
                    name: "Permission",
                    scope: "Scope"
                }
            ]
        }, {
            _id: "612g281261ga",
            name: "Test 2",
            description: "Description 2",
            serviceId: "612g281261gw",
            permissions: [
                {
                    _id: "612g281261aw",
                    name: "Permission",
                    scope: "Scope"
                }
            ]
        }];
        findStub.resolves(queryResult);

        expect(await Trigger.findAllChildrenOfService("612g281261gw")).to.be.equal(queryResult);
    });

    it("should not return children of a service not owned by a user", async () => {
        findStub.throws();

        expect(await Trigger.findAllChildrenOfService("612g281261gw")).to.be.null;
    });
});