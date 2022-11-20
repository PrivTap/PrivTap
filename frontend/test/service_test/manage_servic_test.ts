import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, describe, expect, test } from "vitest";
import IManageService from "../../src/services/manage_service";

describe("Manage Service Tests", () => {

  let manageServiceStub: StubbedInstance<IManageService>;
  beforeAll(() => {
    manageServiceStub = stubInterface<IManageService>();
  });

  test("", async () => {
    expect(true).toBe(true);
  });

});
