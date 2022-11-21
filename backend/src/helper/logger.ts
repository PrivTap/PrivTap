import { colorConsole } from "tracer";
import env from "./env";

let level = "fatal";

if (env.DEV)
    level = "log";

if (env.PROD)
    level = "info";

const logger = colorConsole({
    level: level,
    dateformat: "dd-m hh:mm"
});
export default logger;