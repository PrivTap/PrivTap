import { expect, use } from "chai";
import "../../src/app";
import mongoose, { Types, FilterQuery } from "mongoose";
import Model from "../../src/Model";
import { beforeEach } from "mocha";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import logger from "../../src/helper/logger";
import sinonChai = require("sinon-chai");
import chaiHttp = require("chai-http");

use(chaiHttp);
use(sinonChai);
const sandbox = sinon.createSandbox();

describe("Testing the Model class", () => {

    let existStub: SinonStub;
    let findStub: SinonStub;
    let findOneStub: SinonStub;
    let findByIdStub: SinonStub;
    let findOneAndUpdateStub: SinonStub;
    let deleteOneStub: SinonStub;
    let updateOneStub: SinonStub;
    let saveStub: SinonStub;
    let handleMongooseSavingErrorsStub: SinonStub;
    let loggerErrorStub: SinonStub;
    let model: Model<any>;
    const errorSample = new Error("error");
    let querySample: FilterQuery<any>;
    const documentSample = {
        name: "testingSucks"
    };
    const idSample = "id";

    beforeEach(() => {
        existStub = sandbox.stub(mongoose.Model, "exists");
        findStub = sandbox.stub(mongoose.Model, "find");
        findOneStub = sandbox.stub(mongoose.Model, "findOne");
        findByIdStub = sandbox.stub(mongoose.Model, "findById");
        findOneAndUpdateStub = sandbox.stub(mongoose.Model, "findOneAndUpdate");
        deleteOneStub = sandbox.stub(mongoose.Model, "deleteOne");
        updateOneStub = sandbox.stub(mongoose.Model, "updateOne");
        saveStub = sandbox.stub(model["model"].prototype, "save");
        loggerErrorStub = sandbox.stub(logger, "error");
        handleMongooseSavingErrorsStub = sandbox.stub(Model.prototype, <any>"handleMongooseSavingErrors");
    });

    afterEach(async () => {
        sandbox.restore();
    });
    before(() => {
        model = new Model<any>("name", new mongoose.Schema<any>());
    });

    it("should return true when the save function work", async () => {
        saveStub.resolves();
        const res = await model.insert(documentSample);
        expect(res).to.be.true;
    });

    it("should return false when the save function fail", async () => {
        saveStub.throws(errorSample);
        handleMongooseSavingErrorsStub.resolves();
        const res = await model.insert(documentSample);
        expect(handleMongooseSavingErrorsStub).to.have.been.calledOnceWith(errorSample);
        expect(res).to.be.false;
    });

    it("Update should return false if the update from mongoose resolve", async () => {
        //we only need this for the field "modifiedCount"
        updateOneStub.resolves({
            modifiedCount: 1,
            acknowledged: false,
            matchedCount: 0,
            upsertedCount: 0,
            upsertedId: new Types.ObjectId("612g281261gw")
        });
        const res = await model.update(idSample, documentSample);
        expect(updateOneStub).to.have.been.calledOnceWith({ _id: idSample }, documentSample);
        expect(res).to.be.true;
    });

    it("Update should return false if the update from mongoose fail", async () => {
        updateOneStub.throws(errorSample);
        handleMongooseSavingErrorsStub.resolves();
        const res = await model.update(idSample, documentSample);
        expect(updateOneStub).to.have.been.calledOnceWith({ _id: idSample }, documentSample);
        expect(res).to.be.false;
        expect(handleMongooseSavingErrorsStub).to.have.been.calledOnceWith(errorSample);
        expect(res).to.be.false;
    });

    it("updateWithFilter should return false if the update with Filter from mongoose resolve", async () => {
        //we only need this for the field "modifiedCount"
        updateOneStub.resolves({
            modifiedCount: 1,
            acknowledged: false,
            matchedCount: 0,
            upsertedCount: 0,
            upsertedId: new Types.ObjectId("612g281261gw")
        });
        const res = await model.updateWithFilter(querySample, documentSample);
        expect(updateOneStub).to.have.been.calledOnceWith(querySample, documentSample);
        expect(res).to.be.true;
    });

    it("updateWithFilter should return false if the update with Filter from mongoose fail", async () => {
        updateOneStub.throws(errorSample);
        handleMongooseSavingErrorsStub.resolves();
        const res = await model.updateWithFilter(querySample, documentSample);
        expect(updateOneStub).to.have.been.calledOnceWith(querySample, documentSample);
        expect(res).to.be.false;
        expect(handleMongooseSavingErrorsStub).to.have.been.calledOnceWith(errorSample);
    });

    it("delete should return true if the delete from mongoose resolve ", async () => {
        //we only need this for the field "modifiedCount"
        deleteOneStub.resolves({
            n: 1,
            ok: 1,
            deletedCount: 1
        });
        const res = await model.delete(idSample);
        expect(deleteOneStub).to.have.been.calledOnceWith({ _id: idSample });
        expect(res).to.be.true;
    });

    it(" delete should return false if the delete from mongoose fail ", async () => {
        //we only need this because we don't want to print the error
        loggerErrorStub.resolves(true);
        deleteOneStub.throws(errorSample);
        const res = await model.delete(idSample);
        expect(deleteOneStub).to.have.been.calledOnceWith({ _id: idSample });
        expect(res).to.be.false;
    });
    it("find should return what the findOne from mongoose return", async () => {
        findOneStub.resolves(documentSample);
        const res = await model.find(querySample);
        expect(res).to.be.eql(documentSample);
        expect(findOneStub).to.have.been.calledOnceWith(querySample);
    });

    it("find should fail what the findOne from mongoose fail", async () => {
        findOneStub.throws(errorSample);
        loggerErrorStub.resolves();
        const res = await model.find(querySample);
        expect(res).to.be.eql(null);
        expect(findOneStub).to.have.been.calledOnceWith(querySample);
    });

    it("findById should return what the findById from mongoose return ", async () => {
        findByIdStub.resolves(documentSample);
        const res = await model.findById(idSample);
        expect(findByIdStub).to.have.been.calledOnceWith(idSample);
        expect(res).to.be.eql(documentSample);
    });
    it("findById  should fail what the findById from mongoose fail", async () => {
        findByIdStub.throws(errorSample);
        loggerErrorStub.resolves();
        const res = await model.findById(idSample);
        expect(res).to.be.eql(null);
        expect(findByIdStub).to.have.been.calledOnceWith(idSample);
    });
    it("findAndUpdate should return what findOneAndUpdate from mongoose return", async () => {
        findOneAndUpdateStub.resolves(documentSample);
        const res = await model.findAndUpdate(querySample, querySample);
        expect(findOneAndUpdateStub).to.have.been.calledOnceWith(querySample, querySample);
        expect(res).to.be.eql(documentSample);
    });
    it("findAndUpdate should fail what the findOneAndUpdate from mongoose fail", async () => {
        findOneAndUpdateStub.throws(errorSample);
        loggerErrorStub.resolves();
        const res = await model.findAndUpdate(querySample, querySample);
        expect(res).to.be.eql(null);
        expect(findOneAndUpdateStub).to.have.been.calledOnceWith(querySample, querySample);
    });
    it("findAll should return what find from mongoose return", async () => {
        findStub.resolves([documentSample]);
        const res = await model.findAll();
        expect(findStub).to.have.been.calledOnceWith();
        expect(res).to.be.eql([documentSample]);
    });
    it("findAllshould fail what the find from mongoose fail", async () => {
        findStub.throws();
        loggerErrorStub.resolves();
        const res = await model.findAll();
        expect(res).to.be.eql(null);
        expect(findStub).to.have.been.calledOnceWith();
    });
});
