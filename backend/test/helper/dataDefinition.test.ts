import { expect } from "chai";
import {
    checkCompatibility,
    DataDefinition,
    dataDefinitionIDs,
    EntryDefinition,
    transformStringInDataDef
} from "../../src/helper/dataDefinition";
import { DataType } from "../../src/helper/dataType";

describe("Data Definition helper module", () => {

    const mockDefinitionT: DataDefinition = {
        trigger_data: [
            {
                identifier: "title",
                type: DataType.Text
            },
            {
                identifier: "comments",
                type: DataType.Array,
                content: {
                    type: DataType.Text
                }
            },
            {
                identifier: "date",
                type: DataType.Date
            }
        ]
    };

    const compatibleActionDefinition: DataDefinition = {
        trigger_data: [
            {
                identifier: "title",
                type: DataType.Text
            },
            {
                identifier: "date",
                type: DataType.Date
            }
        ]
    };

    const incompatibleActionDefinition: DataDefinition = {
        trigger_data: [
            {
                identifier: "title-post",
                type: DataType.Text
            }
        ]
    };

    it("should correctly check for compatibility between objects", () => {
        expect(checkCompatibility(mockDefinitionT, compatibleActionDefinition)).to.be.true;
    });

    it("should return that two actions are not compatible", () => {
        expect(checkCompatibility(mockDefinitionT, incompatibleActionDefinition)).to.be.false;
    });

    it("should correctly extract data definition IDs", function () {
        expect(dataDefinitionIDs(compatibleActionDefinition)).to.be.eql(["title", "date"]);
    });

    it("should correctly reject poorly encoded data definition entries", function () {
        const wrongEntry = "[{'identifier': 'something', 'type': 'RANDOM'}]";
        expect(transformStringInDataDef(wrongEntry)).to.be.null;
    });

    it("should correctly reject poorly encoded data definition entries", function () {
        const wrongEntry = "{trigger_data: [{'identifier': 'something', 'type': 'RANDOM'}]}";
        expect(transformStringInDataDef(wrongEntry)).to.be.null;
    });
});