import { expect } from "chai";

import "../../src/app";
import mongoose, { Types } from "mongoose";
import Service from "../../src/model/Service";
import { beforeEach } from "mocha";
import { SinonStub } from "sinon";

import { randomInt } from "crypto";
import * as sinon from "sinon";



const sandbox = sinon.createSandbox();

describe("Testing the Service model class", () => {

    let existStub: SinonStub;
    let findStub: SinonStub;
    let findOneStub: SinonStub;
    let deleteOneStub: SinonStub;
    let updateOneStub: SinonStub;
    let saveStub: SinonStub;

    beforeEach(() => {
        existStub = sandbox.stub(mongoose.Model, "exists");
        findStub = sandbox.stub(mongoose.Model, "find");
        findOneStub = sandbox.stub(mongoose.Model, "findOne");
        deleteOneStub = sandbox.stub(mongoose.Model, "deleteOne");
        updateOneStub = sandbox.stub(mongoose.Model, "updateOne");
        saveStub = sandbox.stub(Service["serviceModel"].prototype, "save");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("should create a new service", async () => {
        existStub.resolves(null);
        saveStub.resolves();

        expect(await Service.insert("Test", "Test", "A Creator ID", undefined, undefined, undefined)).to.be.true;
    });

    it("should not create a duplicate service", async () => {
        existStub.resolves({ _id: "Something" });
        saveStub.resolves();

        expect(await Service.insert("Test", "Test", "A Creator ID", undefined, undefined, undefined)).to.be.false;
    });

    it("should not create a service if the save method fails", async () => {
        existStub.resolves(null);
        saveStub.throws();

        expect(await Service.insert("Test", "Test", "A Creator ID", undefined, undefined, undefined)).to.be.false;
    });

    it("should correctly find user services", async () => {
        const queryResult = [{
            _id: "612g281261gw",
            name: "Test 1",
            description: "Description 1",
            creator: "612g281261gw",
            authServer: "https://www.test.com/auth",
            clientId: "Client ID",
            clientSecret: "Client Secret"
        }, {
            _id: "612g281261ga",
            name: "Test 2",
            description: "Description 2",
            creator: "612g281261gw",
            authServer: "https://www.test.com/auth",
            clientId: "Client ID",
            clientSecret: "Client Secret"
        }];
        findStub.resolves(queryResult);

        expect(await Service.findServicesCreatedByUser("612g281261gw")).to.be.equal(queryResult);
    });

    it("should return null if the find fails", async () => {
        findStub.throws();

        expect(await Service.findServicesCreatedByUser("612g281261gw")).to.be.null;
    });

    it("should correctly find one user service", async () => {
        const queryResult = [{
            _id: "612g281261ga",
            name: "Test 1",
            description: "Description 1",
            creator: "612g281261gw",
            authServer: "https://www.test.com/auth",
            clientId: "Client ID",
            clientSecret: "Client Secret"
        }];
        findOneStub.resolves(queryResult);

        expect(await Service.findServiceCreatedByUser("612g281261gw", "612g281261ga")).to.be.equal(queryResult);
    });

    it("should return null if the findOne fails", async () => {
        findOneStub.throws();

        expect(await Service.findServiceCreatedByUser("612g281261gw", "612g281261ga")).to.be.null;
    });

    it("should correctly delete a service", async () => {
        deleteOneStub.resolves();

        expect(await Service.deleteService("612g281261gw", "612g281261ga")).to.be.true;
    });

    it("should return null if the delete fails", async () => {
        deleteOneStub.throws();

        expect(await Service.deleteService("612g281261gw", "612g281261ga")).to.be.false;
    });

    it("should correctly update a service", async () => {
        updateOneStub.resolves({
            modifiedCount: 1,
            acknowledged: false,
            matchedCount: 0,
            upsertedCount: 0,
            upsertedId: new Types.ObjectId("612g281261gw")
        });

        expect(await Service.updateService("612g281261gw", "ARandomID", null, null, null, null)).to.be.true;
    });

    it("should return null if the update fails", async () => {
        updateOneStub.throws();

        expect(await Service.updateService("612g281261gw", "ARandomID", null, null, null, null)).to.be.false;
    });
    it("should correctly executes the query with the correct parameter", async () => {
        const itemsPerPage = randomInt(0, 100);
        const page = randomInt(0, 100);

        const limitSpy = sinon.spy(mongoose.Query.prototype, "limit");
        const skipSpy = sinon.spy(mongoose.Query.prototype, "skip");
        const selectSpy = sinon.spy(mongoose.Query.prototype, "select");
        await Service.findServices(itemsPerPage, page);
        expect(findStub).to.be.calledOnce;
        limitSpy.calledOnceWith(itemsPerPage);
        skipSpy.calledOnceWith(itemsPerPage * page);
        selectSpy.calledOnceWith("name description -_id");
    });
});