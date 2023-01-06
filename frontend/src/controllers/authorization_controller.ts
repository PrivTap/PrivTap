import type { StandartRepsonse } from "@/model/response_model";
import type { UserModel } from "@/model/user_model";
import { computed, ref, type Ref } from "vue";
import { GenericController } from "./generic_controller";

let reference = ref<UserModel | null>(null);

interface IAuthController {
    login(username: string, password: string): Promise<UserModel | null>;
    logout(): Promise<boolean>;
    activate(token: String): Promise<boolean>;
    register(
        username: string,
        email: string,
        password: string
    ): Promise<boolean>;
    setUser(newUser: UserModel | null): void;
}

class AuthController extends GenericController<UserModel | null> implements IAuthController {

    isAuthenticated = computed(() => reference.value != null);

    async login(username: string, password: string): Promise<UserModel | null> {
        const body = {
            username: username,
            password: password,
        };
        const res = await super.post<UserModel>(
            "/login",
            { body: body, message: "Login Success!" }
        );
        this.setUser(res);
        return res;
    }
    async logout(): Promise<boolean> {
        const res = await super.get("/logout", { message: "Logout Success!" });
        this.setUser(null);
        if (res == null) return false;
        return true;
    }
    async activate(token: String): Promise<boolean> {
        const res = await super.post("/activate", {
            body: { token: token }, message: "Account activated successfully!"
        });
        /// Means error
        if (res == null) return false;
        const stringUser = localStorage.getItem("user");
        if (!stringUser) {
            if (reference.value) {
                reference.value.isConfirmed = true;
                this.setUser(reference.value);
            }
        } else {
            const app = JSON.parse(stringUser) as UserModel;
            app.isConfirmed = true;
            this.setUser(app);
        }
        return true;
    }
    async register(username: string, email: string, password: string): Promise<boolean> {
        const body = {
            username: username,
            email: email,
            password: password,
        };
        const res = await super.post("/register", { body: body, message: "Registration Success! Please check your email to activate your account." });
        return res != null;
    }
    setUser(newUser: UserModel | null): void {
        reference.value = newUser;
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    }
    /**
     * Return the object reference of this controller. The controller is a singleton, so the reference is the same for all the class
     */
    getRef(): Ref<UserModel | null> {
        return reference;
    }


}

export default new AuthController();