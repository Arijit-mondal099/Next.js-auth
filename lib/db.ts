import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) throw new Error("DB Connection URI not Provided!")

export async function dbConnection() {
    try {
        mongoose.connect(MONGODB_URI)
        const connection = mongoose.connection

        connection.on("connected", () => { console.log("DB Connected") })
        connection.on("error", (err) => { throw new Error("DB Connection Error, please make sure db is up and running" + err) })
    } catch (error) {
        console.error("DB Connection Error!")
        console.error(error)
        process.exit(1)
    } 
}
