import { checkURL } from "../../src/helper/misc";
import { expect, request, use } from "chai";
import * as sinon from "sinon";
import { IUser } from "../../src/model/User";
import app from "../../src/app";
import chaiHttp = require("chai-http");


use(chaiHttp);

describe("Testing authentication helper module", () => {

    let requester: ChaiHttp.Agent;

    before(async () => {
        requester = request(app.express).keepOpen();
    });

    after(async () => {
        requester.close();
    });

    it("should correctly verify a correct URL", () => {
        expect(checkURL("https://www.apple.com/something")).to.be.true;
        expect(checkURL("http://www.apple.com/something")).to.be.true;
        expect(checkURL("http://apple.com/something")).to.be.true;
    });

    it("should not verify a non-URL string", () => {
        expect(checkURL("something")).to.be.false;
        expect(checkURL("http://apple")).to.be.false;
    });

    it("should not verify non-http URLs", () => {
        expect(checkURL("mailto://test.mail@mail.com")).to.be.false;
        expect(checkURL("file://Users/test/Desktop/file.txt")).to.be.false;
    });
});