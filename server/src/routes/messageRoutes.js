import { Router } from 'express';
import { v4 as generateID } from "uuid";

import { connectToDB } from '../MongoClient.js'

const router = Router();

// POST, post a new message
router.post('/', async (req, res) => {
  const client = await connectToDB();
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
    console.error(err)
  }
});

// PATCH, like a message
router.patch('/:id/like', async (req, res) => {
  const client = await connectToDB();
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
  }
});

export default router;