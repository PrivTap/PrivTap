import { colorConsole } from "tracer";
import env from "./env";

// log: 0, trace: 1, debug: 2, info: 3, warn: 4, error: 5, fatal: 6
const level = env.LOG_LEVEL;

const logger = colorConsole({
    level: level,
    dateformat: "dd-m hh:mm"
});
export default logger;