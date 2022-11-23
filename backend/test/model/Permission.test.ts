import { expect } from "chai";

import "../../src/app";
import { Permission } from "../../src/model/Permission";

describe("Testing the Permission model class", () => {

    it("should test Permission creation", async () => {
        const permission = new Permission("ScopeLevel", "A Test Permission");

        expect(permission.getName()).to.be.equal("A Test Permission");
        expect(permission.getScope()).to.be.equal("ScopeLevel");
    });
});