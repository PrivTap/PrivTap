import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { StandartRepsonse } from "../../src/model/response_model";
import { UserModel } from "../../src/model/user_model";
import AuthService from "../../src/controllers/auth_controller";
import MockAdapter from "axios-mock-adapter";

describe("Auth Service Tests", () => {
  let mock: MockAdapter;
  const _authService = new AuthService();
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
    mock = new MockAdapter(_authService.http);
  });

  beforeEach(() => {
    mock.resetHandlers();
  });

  test("Shoud success with correct username and password", async () => {
    mock.onPost("/login").reply(200, successResponseWithUser);
    const res = await _authService.login("username", "passwordlong");
    expect(res).toEqual(userTest);
    expect(res?.username).toEqual("test");
  });

  test("Should fail with wrong username and password", async () => {
    mock.onPost("/login").reply(400, errorResponse);
    const res = await _authService.login("username", "wrongpassword");
    expect(res).toBeNull();
  });

  test("Should fail with empyt username", async () => {
    mock.onPost("/login").reply(400, errorResponse);
    const res = await _authService.login("", "wrongpassword");
    expect(res).toBeNull();
  });

  test("Should fail with empyt password", async () => {
    mock.onPost("/login").reply(400, errorResponse);
    const res = await _authService.login("username", "");
    expect(res).toBeNull();
  });

  test("Should success with correct username, email and password", async () => {
    mock.onPost("/register").reply(200, true);
    const res = await _authService.register(
      "username",
      "email@email.it",
      "passwordlong"
    );
    expect(res).to.true;
  });

  test("Should fail with low username length", async () => {
    mock.onPost("/register").reply(400, errorResponse);
    const res = await _authService.register(
      "u",
      "email@email.it",
      "passwordlong"
    );
    expect(res).to.false;
  });

  test("Should fail with not a Email format", async () => {
    mock.onPost("/register").reply(400, errorResponse);
    const res = await _authService.register("username", "wrongemail", "passwordlong");
    expect(res).to.false;
  });

  test("Should fail with not a low password length", async () => {
    mock.onPost("/register").reply(400, errorResponse);
    const res = await _authService.register("username", "email@emal.it", "lowpsw");
    expect(res).to.false;
  });

  test("Should fail with wrong token", async () => {
    mock.onPost("/activate", { token: "wrongToken" }).reply(400, errorResponse);
    const res = await _authService.activate("wrongToken");
    expect(res).to.false;
  });

  test("Should success with right token", async () => {
    mock.onPost("/activate", { token: "238y28h9bs829b893" }).reply(200, { status: true });
    const res = await _authService.activate("238y28h9bs829b893");
    expect(res).toBe(true);
  });

  test("Shoud success if has cookie or token", async () => {
    mock.onGet("/logout").reply(200, { status: true, message: "" });
    const res = await _authService.logout();
    expect(res).toBe(true);
  });

});