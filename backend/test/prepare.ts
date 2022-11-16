import prepare from "mocha-prepare";
import { start, stop } from "mongo-unit";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables from a testing specif .env file
config({ path: join(__dirname, ".test.env") });

// Register callbacks that will be executed when loading/unloading the entire testing environment
prepare(done => {
    // Start the mongo-unit DB instance.
    // mongo-unit will run a MongoDB instance in memory to simplify and speed up testing
    start().then(dbString => {
        process.env.TEST_DB_STRING = dbString;
        done();
    });
}, done => {
    // Stop the mongo-unit DB instance
    stop().then(() => done());
});