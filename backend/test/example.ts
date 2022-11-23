import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
// import { drop, initDb } from "mongo-unit";
// import mongoose from "mongoose";

import app from "../src/app";
import { checkURL } from "../src/helper/misc";
// import User from "../src/model/User";

// import testData from "./fixtures/exampleData.json";

use(chaiHttp);

async function fakeDBQuery() {
    return { myKey: "myValue" };
}

describe("PrivTAP Backend", function() {
    const testUserJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdF91c2VyX2lkIiwiaWF0IjoxNjY4NzA1MTU0fQ.yHDqFZ0N_lu8v2yk20BM0B41-4suCJLVIpNhAagD_wY";

    let requester: ChaiHttp.Agent;

    before(async () => {
        // const testDBString = process.env.TEST_DB_STRING || "INVALId_DB_STRING";
        // await app.connectToDB(testDBString);
        requester = request.agent(app.express).keepOpen();
    });

    after(async () => {
        requester.close();
        // await mongoose.disconnect();
    });

    beforeEach(async () => {
        // await initDb(testData);
    });

    afterEach(async () => {
        // await drop();
    });

    it("should receive fake DB response", async () => {
        const result = await fakeDBQuery();

        if (result.myKey != "myValue")
            throw new Error("Query result is wrong");

    });

    // it("should have user example", async () => {
    //     const user = await User.queryUser("username", "example");
    //     expect(user.username).to.be.eq("example");
    // });

    it("should validate links", async () => {
        expect(checkURL("example@example.com")).to.be.false;
        expect(checkURL("https://example.com/example")).to.be.true;
    });

    describe("AppServer", () => {

        it("should not serve root", async () => {
            const res = await requester.get("/");
            expect(res).to.have.status(404);
        });

        it("should serve /logout only to authenticated user", async () => {
            let res = await requester.get("/logout");
            expect(res).to.have.status(401);

            res = await requester.get("/logout").set("Cookie", `__session=${testUserJWT}`);
            expect(res).to.have.status(200);
        });

    });

});