import { error } from "console";
import { connect, disconnect } from "mongoose"; // package for connect and disconnect db in mongodb
async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL); //process is the current process running as node
    }
    catch {
        console.log(error);
        throw new Error("Can't connect to MongoDB");
    }
}
//somewhere something happens wrong so we need to disconnect the database, a secure approach.
async function disconnectToDatabase() {
    try {
        await disconnect();
    }
    catch {
        console.log(error);
        throw new Error("Can't disconnect to MongoDB");
    }
}
export { connectToDatabase, disconnectToDatabase };
//# sourceMappingURL=connection.js.map