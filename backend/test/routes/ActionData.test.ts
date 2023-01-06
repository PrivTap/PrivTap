/*
import { use, expect, request } from "chai";
import chaiHttp = require("chai-http");
import { createSandbox, SinonStub } from "sinon";
import sinonChai = require("sinon-chai");
import app from "../../src/app";
import DataRuleExecution from "../../src/model/DataRuleExecution";

use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/services endpoint", () => {
    let requester: ChaiHttp.Agent;
    let findByIdStub: SinonStub;
    let downloadAndDeleteFileStub: SinonStub;
    const dataIdExample = "dataId";
    const apiKeyExample = "key";

    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        findByIdStub = sandbox.stub(DataRuleExecution, "findById");
        downloadAndDeleteFileStub =sandbox.stub(DataRuleExecution,"downloadAndDeleteFile");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("GET /", () => {
        it("should fail if there no good parameter", async () => {
            let res = await requester.get("/action-data");
            expect(res).to.have.status(400);
            res = await requester.get("/action-data").query({ apiKey: apiKeyExample });
            expect(res).to.have.status(400);
            res = await requester.get("/action-data").query({ dataId: dataIdExample });
            expect(res).to.have.status(400);
        });

        it("should give forbidden if the apikey is wrong or there is no data to retrieve", async () => {
            findByIdStub.resolves(null);
            let res = await requester.get("/action-data").query({ apiKey: apiKeyExample,dataId: dataIdExample });
            expect(res).to.have.status(403);
            findByIdStub.resolves({ apiKey: "differentApiKey" });
            res = await requester.get("/action-data").query({ apiKey: apiKeyExample,dataId: dataIdExample });
            expect(res).to.have.status(403);
        });

        it("should fail if an internal error occurs", async () => {
            downloadAndDeleteFileStub.resolves(null);
            findByIdStub.resolves({ apiKey: apiKeyExample });
            const res = await requester.get("/action-data").query({ apiKey: apiKeyExample,dataId: dataIdExample });
            expect(res).to.have.status(500);
        });

        it("should succeed if the request is send with the stream", async () => {
            downloadAndDeleteFileStub.resolves("something");
            findByIdStub.resolves({ apiKey: apiKeyExample });
            const res = await requester.get("/action-data").query({ apiKey: apiKeyExample,dataId: dataIdExample });
            expect(res).to.have.status(200);
        });
    });

});

*/


