import "dotenv/config";
import express from "express";
import { Collection, MongoClient } from "mongodb";
import cors from "cors";
import { v4 as generateID } from "uuid";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import path from 'path'
import { fileURLToPath } from 'url'

const CONNECT_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/`;

const app = express();
const PORT = process.env.SERVER_PORT;
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`,
};

app.use(express.json({limit: "10mb"}));
app.use(cors(corsOptions));

//image
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended:true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/public')));

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));


app.get('/users', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const data = await client
      .db("chat_app")
      .collection("users")
      .find()
      .toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err });
  } finally {
    if (client) {
      client.close();
    }
  }
})

// GET, fetch a specific user by ID
app.get('/users/:id', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const userId = req.params.id;
    const user = await client
      .db('chat_app')
      .collection('users')
      .findOne({ _id: userId });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

//create new user
const checkUniqueUser = async (req, res, next) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    const sameUsername = await client
      .db('chat_app')
      .collection('users')
      .findOne({username: req.body.username});

      if(sameUsername){
        res.status(409).send({error: "Username already exists!"});
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

//create new user if unique
app.post("/users", checkUniqueUser, async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    const { username, profileImage } = req.body;

    const defaultProfileImg = '/default-user-icon.jpg'

    const newUser = {
      _id: generateID(),
      username,
      profileImage: profileImage || defaultProfileImg,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    const result = await client
      .db('chat_app')
      .collection('users')
      .insertOne(newUser);
    
    const data = await client
    .db('chat_app')
    .collection('users')
    .findOne({ _id: result.insertedId });
    
    res.send(data);
  }catch(err){
    res.status(500).send(err);
  } finally{
    client.close();
  }
});

//POST, returning user by username and password
app.post("/users/login", async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{

    const data = await client
      .db('chat_app')
      .collection('users')
      .findOne({username: req.body.username})

    if(data === null){ //? wrong username
      res.status(401).send({ error: "User not Found!"});
    } else{ //? user was found by username
      const checkPassword = await bcrypt.compare(req.body.password, data.password);

      if(!checkPassword){
        res.status(401).send({error: "Wrong password!"});
      } else{
        res.send(data)
      }
    }
  }catch(err){
    res.status(500).send(err);
  } finally{
    client.close();
  }
})

// PATCH, edit users username
app.patch('/users/:id/username', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    const id = req.params.id;
    const newUsername = req.body.username;

    const user = await client
    .db('chat_app')
    .collection('users')
    .findOne({ _id: id });

    if (user.username === newUsername) {
      return res.status(409).send({ error: "Cannot change to the same username" });
    }

    const patchResponse = await client
    .db('chat_app')
    .collection('users')
    .findOneAndUpdate(
      { _id: id },
      { $set: { username: newUsername } },
      { returnDocument: 'after' }
    )
    res.send(patchResponse);
  } catch(err){
    res.status(500).send(err);
  } finally{
    client.close();
  }
})

//PATCH, edit users password
app.patch('/users/:id/password', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try{
    const id = req.params.id;
    const {oldPassword, newPassword} = req.body;


    const user = await client
      .db('chat_app')
      .collection('users')
      .findOne({_id: id});

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ error: "Old password is incorrect" });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    
    const patchResponse = await client
    .db('chat_app')
    .collection('users')
    .updateOne(
      { _id: id },
      { $set: { password: hashedNewPassword } }
    );

    res.send(patchResponse);
  } catch(err){
    res.status(500).send(err);
  } finally{
    client.close();
  }
});

//PATCH, edit user profile picture
app.patch('/users/:id/profileImage', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const id = req.params.id;
    const { profileImage } = req.body;

    const patchResponse = await client
      .db('chat_app')
      .collection('users')
      .findOneAndUpdate(
        { _id: id },
        { $set: { profileImage } },
        { returnDocument: 'after' }
      );
    res.send(patchResponse);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

app.get('/conversations/:userId', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const loggedInUserId = req.params.userId;

    const conversations = await client
      .db('chat_app')
      .collection('conversations')
      .find({
        participants: loggedInUserId
      })
      .toArray();

    const createdConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId = conversation.participants.find(id => id !== loggedInUserId);

        if (otherUserId) {
          const otherUser = await client
            .db('chat_app')
            .collection('users')
            .findOne({ _id: otherUserId });
          
          return {
            ...conversation,
            otherUserDetails: otherUser
          };
        }
        return conversation;
      })
    );
    res.send(createdConversations);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

//POST, Create new conversations or return existing one
app.post('/conversations', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const { loggedInUserId, otherUserId } = req.body;
    //? tikrinam ar jau yra convo sukurtas
    const existingConversation = await client
    .db('chat_app')
    .collection('conversations')
    .findOne({
      participants: { $all: [loggedInUserId, otherUserId] }
    });
    
    //? jai yra gražinam
    if (existingConversation) {
      res.send(existingConversation);
    } else { //? jai nera, sukuriam
      const newConversation = {
        _id: generateID(),
        participants: [loggedInUserId, otherUserId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: {
          content: '',
          senderId: '',
          createdAt: ''
        }
      };
      
      const result = await client
      .db('chat_app')
      .collection('conversations')
      .insertOne(newConversation);
      
      const data = await client
      .db('chat_app')
      .collection('conversations')
      .findOne({ _id: result.insertedId });
      
      res.send(data);
    }
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

// GET, get messages for that conversation
app.get('/conversations/:id/messages', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    //? pasiemam convo id
    const conversationId = req.params.id;
    const messages = await client
      .db('chat_app')
      .collection('messages')
      .aggregate([
        {
          $match: {
            conversationId: conversationId
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'senderDetails'
          }
        },
        { $unwind: '$senderDetails' }
      ])
      .toArray();
    res.send(messages);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

// POST, post a new message
app.post('/messages', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const { conversationId, senderId, content, createdAt } = req.body;
    const newMessage = {
      _id: generateID(),
      conversationId,
      senderId,
      content,
      createdAt,
      likes: []
    };
    const result = await client
      .db('chat_app')
      .collection('messages')
      .insertOne(newMessage);
    const data = await client
      .db('chat_app')
      .collection('messages')
      .findOne({ _id: result.insertedId });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

// PATCH, update conversations last message
app.patch('/conversations/:id/lastMessage', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    //? pasiemam convo id
    const conversationId = req.params.id;
    const { content, senderId, createdAt } = req.body;
    const patchResponse = await client
      .db('chat_app')
      .collection('conversations')
      .updateOne(
        { _id: conversationId }, //? susirandam conversation pagal id
        //? updatinam messages
        { $set: {lastMessage: { content, senderId, createdAt }} }
      );
    res.send(patchResponse);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});