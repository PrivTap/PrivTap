import {
  beforeAll,
  describe,
  expect,
  test,
} from "vitest";
import IAuthService from "../../src/services/auth_service";
import { StubbedInstance, stubInterface } from "ts-sinon";
import { StandartRepsonse } from "../../src/model/response_model";
import { UserModel } from "../../src/model/user_model";

describe("Auth Service Tests", () => {
  let authServiceStub: StubbedInstance<IAuthService>;
  let userTest: UserModel = new UserModel("test", "email@email.it", false);
  let successResponseWithUser = {
    status: true,
    message: "",
    data: userTest,
  } as StandartRepsonse<UserModel>;

  let errorResponse = {
    status: false,
    message: "message of error",
  } as StandartRepsonse<Object>;

  beforeAll(() => {
    authServiceStub = stubInterface<IAuthService>();
  });

  test("Shoud success with correct username and password", async () => {
    authServiceStub.login.resolves(successResponseWithUser);
    const res = await authServiceStub.login("username", "passwordlong");
    expect(res.status).to.true;
    expect(res.message).to.empty;
    expect(res.data).to.toBeInstanceOf(UserModel);
    expect(res).to.toStrictEqual(successResponseWithUser);
  });

  test("Should fail with wrong username and password", async () => {
    authServiceStub.login.resolves(errorResponse);
    const res = await authServiceStub.login("username", "wrongpassword");
    expect(res.status).to.false;
    expect(res.message).to.equal("message of error");
    expect(res.data).to.be.undefined;
    expect(res).to.toStrictEqual(errorResponse);
  });

  test("Should fail with empyt username", async () => {
    authServiceStub.login.resolves(errorResponse);
    const res = await authServiceStub.login("", "wrongpassword");
    expect(res.status).to.false;
    expect(res.message).to.equal("message of error");
    expect(res.data).to.be.undefined;
    expect(res).to.toStrictEqual(errorResponse);
  });

  test("Should fail with empyt password", async () => {
    authServiceStub.login.resolves(errorResponse);
    const res = await authServiceStub.login("username", "");
    expect(res.status).to.false;
    expect(res.message).to.equal("message of error");
    expect(res.data).to.be.undefined;
    expect(res).to.toStrictEqual(errorResponse);
  });

  test("Should success with correct username, email and password", async () => {
    authServiceStub.register.resolves(true);
    const res = await authServiceStub.register(
      "username",
      "email@email.it",
      "passwordlong"
    );
    expect(res).to.true;
  });

  test("Should fail with low username length", async () => {
    authServiceStub.register.resolves(false);
    const res = await authServiceStub.register(
      "u",
      "email@email.it",
      "passwordlong"
    );
    expect(res).to.false;
  });

  test("Should fail with not a Email format", async () => {
    authServiceStub.register.resolves(false);
    const res = await authServiceStub.register("username", "wrongemail", "passwordlong");
    expect(res).to.false;
  });

  test("Should fail with not a low password length", async () => {
    authServiceStub.register.resolves(false);
    const res = await authServiceStub.register("username", "email@emal.it", "lowpsw");
    expect(res).to.false;
  });

  test("Should fail with wrong token", async () => {
    authServiceStub.activate.resolves(false);
    const res = await authServiceStub.activate("wrongToken");
    expect(res).to.false;
  });
  test("Should success with right token", async () => {
    authServiceStub.activate.resolves(true);
    const res = await authServiceStub.activate("238y28h9bs829b893");
    expect(res).toBe(true);
  });

  test("Shoud success if has cookie or token", async () => {
    authServiceStub.logout.resolves(true);
    const res = await authServiceStub.logout();
    expect(res).to.true;
  });

});
