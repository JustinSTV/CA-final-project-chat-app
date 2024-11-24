import { MongoClient } from 'mongodb';

const CONNECT_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

let client;

export const connectToDB = async () => {
  if(!client){
    client = new MongoClient({ useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
  return client;
} 