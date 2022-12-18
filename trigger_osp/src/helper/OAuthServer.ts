import bcrypt from "bcrypt"
import env from "./env";
import Authorization from "../model/Authorization";
export default class OAuthServer {
    static async generateCode(userId: string): Promise<string | null>{
        const code = await bcrypt.genSalt(env.SALT_ROUNDS);
        if (!await Authorization.update({ code }, userId))
            return null;
        return code;
    }
}