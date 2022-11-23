import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { createSandbox, SinonStub } from "sinon";
import sinonChai from "sinon-chai";
import app from "../../src/app";
import Service from "../../src/model/Service";
import Authentication from "../../src/helper/authentication";



use(chaiHttp);
use(sinonChai);

const sandbox = createSandbox();

describe("/services endpoint", () => {
    let requester: ChaiHttp.Agent;
    let checkJWTStub: SinonStub;
    let findServicesStub: SinonStub;
    before(() => {
        requester = request(app.express).keepOpen();
    });

    after(() => {
        requester.close();
    });

    beforeEach(() => {
        checkJWTStub = sandbox.stub(Authentication, "checkJWT");
        checkJWTStub.returns("userId");
        findServicesStub = sandbox.stub(Service, "findServices");
    });

    afterEach(() => {
        sandbox.restore();
    });
    describe("GET /", () => {
        it("should call the query with the correct parameter and succeed", async () => {
            findServicesStub.resolves([]);
            let res = await requester.get("/services");
            expect(res).to.have.status(200);
            expect(findServicesStub).to.have.been.calledOnceWith(undefined, undefined);
            res = await requester.get("/services").query({ items: 3 });
            expect(res).to.have.status(200);
            expect(findServicesStub).to.have.been.calledWith(3, undefined);
            res = await requester.get("/services").query({ items: 3, page: 1 });
            expect(res).to.have.status(200);
            expect(findServicesStub).to.have.been.calledWith(3, 1);
        });
        it("should fail when the query to database is not working", async () => {
            findServicesStub.resolves(null);
            const res = await requester.get("/services").query({ items: "ciao", page: 1 });
            expect(res).to.have.status(500);
        });
    });
});


