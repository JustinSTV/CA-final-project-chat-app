import { MongoClient } from 'mongodb';
import "dotenv/config"

const CONNECT_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

let client;

export const connectToDB = async () => {
  if (!client) {
    client = new MongoClient(CONNECT_URL, {
      connectTimeoutMS: 30000
    });
  }
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }

  return client;
}