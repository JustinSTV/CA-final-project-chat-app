import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { v4 as generateID } from "uuid";
import bcrypt from "bcrypt";

const CONNECT_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

const app = express();
const PORT = process.env.SERVER_PORT;
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`,
};

app.use(express.json());
app.use(cors(corsOptions));

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));


const checkUniqueUser = async (req, res, next) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    const sameUsername = await client
      .db('chat_app')
      .collection('users')
      .findOne({username: req.body.username});

      console.log("checking:", sameUsername);

      if(sameUsername){
        res.status(409).send({errorMessage: "Username already exists!"});
      } else{
        next();
      }
  } catch(err){
    res.status(500).send(err);
    console.error("Error in checkUniqueUser middleware:", err);
  } finally{
    client.close();
  }
};

app.post("/users", checkUniqueUser, async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    // console.log("req body:", req.body);
    const { username, profileImage } = req.body;
    const newUser = {
      username,
      profileImage: profileImage || 'default-user-icon.jpg',
      password: bcrypt.hashSync(req.body.password, 10),
      _id: generateID()
    }
    const data = await client
      .db('chat_app')
      .collection('users')
      .insertOne(newUser);
    
    console.log("data po inserto:", data);
    res.send(data);
  }catch(err){
    res.status(500).send(err);
  } finally{
    client.close();
  }
})