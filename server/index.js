import "dotenv/config";
import express from "express";
import { Collection, MongoClient } from "mongodb";
import cors from "cors";
import { v4 as generateID } from "uuid";
import bodyParser from "body-parser";
import path from 'path'
import { fileURLToPath } from 'url'

import userRoutes from './src/routes/userRoutes.js'

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

app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));



//GET, get every conversation of logged in user
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

    //? pasiemam convos masyva
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

// DELETE, delete a conversation by ID
app.delete('/conversations/:id', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    const conversationId = req.params.id;

    // Delete the conversation
    const deleteConvo = await client
      .db('chat_app')
      .collection('conversations')
      .deleteOne({ _id: conversationId });

    const deleteConvoMessages = await client
    .db('chat_app')
    .collection('messages')
    .deleteMany({ conversationId: conversationId });

    res.send({ deleteConvo, deleteConvoMessages});
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
        },
        unreadMessages: 0
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
          //? filtering messages by conversationId
          $match: {
            conversationId: conversationId
          }
        },
        {
          //? useris kuris išsiunte žinute
          $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'senderDetails'
          }
        },
        //? pasiemam objekta
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

//PATCH, update unreadMessages
app.patch('/conversations/:id/read', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
    //? pasiemam convo id
    const conversationId = req.params.id;

    //? update conversation to read
    await client
      .db('chat_app')
      .collection('messages')
      .updateMany(
        { conversationId },
        { $set: { read: true } }
      );

    //? kai perskaito, atnaujiname atgal į 0
    await client
      .db('chat_app')
      .collection('conversations')
      .updateOne(
        { _id: conversationId },
        { $set: { unreadMessages: 0 } }
      );

    res.send({ success: true });
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
      likes: [],
      read: false
    };
    const result = await client
      .db('chat_app')
      .collection('messages')
      .insertOne(newMessage);

    //? pridedame kiek neperskaitytu žinučiu yra
    await client
      .db('chat_app')
      .collection('conversations')
      .updateOne(
        { _id: conversationId },
        { $inc: { unreadMessages: 1 } }
      );

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
        { 
          $set: {
            lastMessage: { content, senderId, createdAt },
            updatedAt: new Date().toISOString()
          } 
        }
      );
    res.send(patchResponse);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});

// PATCH, like a message
app.patch('/messages/:id/like', async (req, res) => {
  const client = await MongoClient.connect(CONNECT_URL);
  try {
        const messageId = req.params.id;
    const { userId, isLiked } = req.body;

    const message = await client
      .db('chat_app')
      .collection('messages')
      .findOne({ _id: messageId });

    if (message.senderId === userId) {
      return res.status(400).send({ error: "Cannot like your own message" });
    }

    const updateResponse = await client
      .db('chat_app')
      .collection('messages')
      .updateOne(
        { _id: messageId },
        isLiked
          ? { $pull: { likes: userId } }
          : { $addToSet: { likes: userId } }
      );

    res.send(updateResponse);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    client.close();
  }
});