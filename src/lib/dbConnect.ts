import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Using existing connection");
        return;

    }
    try {

        const db = await mongoose.connect(process.env.MONGODB_URI || '', { dbName: process.env.DB_NAME, });

        connection.isConnected = db.connections[0].readyState;
        console.log("New connection created");
        console.log("Database Connected");
        // console.log("db", db);
    } catch (error) {
        console.log("Database Connection Failed ", error);
        throw new Error("Database Connection Failed");
    }
}

export default dbConnect;