import {afterEach, beforeAll, beforeEach, describe, test} from "vitest";

import SimpleServiceModel from "../../src/model/simple_service_model";
import axiosInstance from "../../src/helpers/axios_service";
import showServices from "../../src/controllers/show_services";
import {SinonStub} from "sinon";
import * as sinon from "sinon";
import {use, expect} from "chai";
import sinonChai = require("sinon-chai");

use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Service Tests", () => {
    let getStub: SinonStub;
    let testServiceModel: SimpleServiceModel = new SimpleServiceModel(
        "Test Service id",
        "Test Service Name",
        "Test Description",
        0,
    );
    beforeAll(() => {
    });

    beforeEach(() => {
        getStub = sandbox.stub(axiosInstance, "get");

    });
    afterEach(async () => {
        sandbox.restore();
        showServices.getRef().value = [];
    })


    /// Test createService
    test("should return all the services", async () => {
        getStub.resolves({data: {data: [testServiceModel]}})
        await showServices.getAllServices();
        expect(showServices.getRef().value).to.be.eql([testServiceModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await showServices.getAllServices();
        expect(showServices.getRef().value).to.be.eql([]);
    })
    test("should return all the authorized services", async () => {
        getStub.resolves({data: {data: [testServiceModel]}})
        await showServices.getAllServices();
        expect(showServices.getRef().value).to.be.eql([testServiceModel]);
    });
    test("Should put nothing in the ref value if the gets failed", async () => {
        getStub.resolves(null);
        await showServices.getAllServices();
        expect(showServices.getRef().value).to.be.eql([]);
    })

});

