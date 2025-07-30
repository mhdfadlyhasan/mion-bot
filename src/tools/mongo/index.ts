import { ObjectId, MongoClient, Db, Collection } from "mongodb"

export async function connectToDatabase() {
	const client: MongoClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING!)
	await client.connect()
	const dbName = "server"
	const db: Db = client.db(dbName)

	const serverCollection: Collection = db.collection(dbName)

	console.log(`Successfully connected to database: ${db.databaseName} and collection: ${serverCollection.collectionName}`)
}
