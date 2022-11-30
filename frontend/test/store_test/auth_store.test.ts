import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../../src/stores/auth_store";
import { UserModel } from "../../src/model/user_model";
import { describe, expect, it, beforeEach } from "vitest";

describe("Auth Store Test", () => {
  let userTest: UserModel;
  let authStore;
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
    userTest = new UserModel("testusername", "email@email.it", false);
    authStore = useAuthStore();
    authStore.setUser(null);
  });

  it("Should change the isAuthenitcated to TRUE - Login Test Success", () => {
    expect(authStore.user).toStrictEqual(null);
    expect(authStore.isAutheticated).toBe(false);
    authStore.setUser(userTest);
    expect(authStore.isAutheticated).toBe(true);
    expect(authStore.user).toStrictEqual(userTest);
  });

  it("Set Login Test Fail", () => {
    expect(authStore.user).toStrictEqual(null);
    expect(authStore.isAutheticated).toBe(false);
    authStore.setUser(null);
    expect(authStore.isAutheticated).toBe(false);
    expect(authStore.user).toStrictEqual(null);
  });
  it("Logout Test Success", () => {
    authStore.setUser(userTest);
    expect(authStore.isAutheticated).toBe(true);
    expect(authStore.user).toStrictEqual(userTest);
    authStore.logout();
    expect(authStore.isAutheticated).toBe(false);
    expect(authStore.user).toStrictEqual(null);
  });
});