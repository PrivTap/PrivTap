import { use, expect, request } from "chai";
import chaiHttp from "chai-http";
import { drop, initDb } from "mongo-unit";
import mongoose from "mongoose";

import app from "../src/app";
import { checkURL } from "../src/helper/misc";
import User from "../src/model/User";

import testData from "./fixtures/exampleData.json";

use(chaiHttp);

async function fakeDBQuery() {
    return { myKey: "myValue" };
}

describe("PrivTAP Backend", () => {
    const baseURL = process.env.BASE_URL || "/";

    let requester: ChaiHttp.Agent;

    before(async () => {
        const testDBString = process.env.TEST_DB_STRING || "INVALID_DB_STRING";
        await app.connectToDB(testDBString);
        requester = request(app.express).keepOpen();
    });

    after(async () => {
        requester.close();
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await initDb(testData);
    });

    afterEach(async () => {
        await drop();
    });

    it("should receive fake DB response", async () => {
        const result = await fakeDBQuery();

        if (result.myKey != "myValue")
            throw new Error("Query result is wrong");

    });

    it("should have user example", async () => {
        const user = await User.queryUser("username", "example");
        expect(user.username).to.be.eq("example");
    });

    it("should validate links", async () => {
        expect(checkURL("example@example.com")).to.be.false;
        expect(checkURL("https://example.com/example")).to.be.true;
    });

    describe("AppServer", () => {

        it("should not serve root", async () => {
            const res = await requester.get(baseURL);
            expect(res).to.have.status(404);
        });

    });

});