import {afterEach, beforeAll, beforeEach, describe, expect, test} from "vitest";
import MockAdapter from "axios-mock-adapter";
import SimpleServiceModel from "../../src/model/simple_service_model";
import axiosInstance from "../../src/helpers/axios_service";
import showServices from "../../src/services/show-services";
import { SinonStub } from "sinon";
import * as sinon from "sinon";



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

        //mock = new MockAdapter(showServices.getInstance())
    });

    beforeEach(() => {
        getStub= sandbox.stub(axiosInstance,"get");
    });
    afterEach(async ()=>{
        sandbox.restore();
    })


    /// Test createService
    test("should return a the created service", async () => {
        //mock.onPost(ShowServices.path).reply(200, );
        getStub.resolves({ data: {data: [testServiceModel]}})
        const res = await showServices.getAllServices();
        console.log(res);
        expect(res.value).toStrictEqual([testServiceModel]);
    });

});
