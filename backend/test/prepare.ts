// import { start, stop } from "mongo-unit";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables from a testing specif .env file
config({ path: join(__dirname, ".test.env") });

// Register callbacks that will be executed when loading/unloading the entire testing environment
export const mochaGlobalSetup = async () => {
    // Start the mongo-unit DB instance.
    // mongo-unit will run a MongoDB instance in memory to simplify and speed up testing
    // process.env.TEST_DB_STRING = await start();
};

export const mochaGlobalTeardown = async () => {
    // Stop the mongo-unit DB instance
    // await stop();
};