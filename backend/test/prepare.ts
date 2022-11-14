import prepare from "mocha-prepare";
import {start, stop} from "mongo-unit";

prepare(done => {
    start().then(dbString => {
        process.env.TEST_DB_STRING = dbString;
        done();
    });
}, done => {
    stop().then(() => done());
});