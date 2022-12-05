import { expect, use } from "chai";
import Model from "../../src/Model";
import "../../src/app";
import Service from "../../src/model/Service";
import chaiHttp = require("chai-http");
import { beforeEach } from "mocha";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");

use(chaiHttp);
use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Service model class", () => {

    let findAllStub: SinonStub;
    let findStub: SinonStub;
    const userIdExample = "6373d3b31b03840eb0138708";
    const serviceIdExample = "6373d3b31b03840eb0138708";

    beforeEach(() => {
        findStub = sandbox.stub(Model.prototype, "find");
        findAllStub = sandbox.stub(Model.prototype, "findAll");
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("findAllForUser should return the results of findAll", async () => {
        findAllStub.resolves([{ serviceId: "service" }]);
        const res = await Service.findAllCreatedByUser(userIdExample);
        expect(findAllStub).to.be.calledOnceWith({ creator: userIdExample });
        expect(res).to.be.eql([{ serviceId: "service" }]);

    });

    it("should correctly see if the user is creator", async () => {
        //if it resolves null then it should return false
        findStub.resolves(null);
        const res = await Service.isCreator(userIdExample, serviceIdExample);
        expect(findStub).to.have.been.calledOnceWith({ _id: serviceIdExample, creator: userIdExample });
        expect(res).to.be.false;
    });
    it("isCreator should return true if find resolves something different from null", async () => {
        findStub.resolves("ciao");
        const res = await Service.isCreator(userIdExample, serviceIdExample);
        expect(findStub).to.have.been.calledOnceWith({ _id: serviceIdExample, creator: userIdExample });
        expect(res).to.be.true;
    });

});
