import { colorConsole } from "tracer";

const logger = colorConsole({
    level: "log",
    dateformat: "dd-m hh:mm"
});
export default logger;