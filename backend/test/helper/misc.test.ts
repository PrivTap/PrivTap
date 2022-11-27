import { checkURL } from "../../src/helper/misc";
import { expect } from "chai";

describe("Misc helper module", () => {

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