import { Router } from 'express';

import { connectToDB } from '../MongoClient.js'

const router = Router();

//GET, get every conversation of logged in user
router.get('/:userId', async (req, res) => {
  const client = await connectToDB();
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
router.delete('/:id', async (req, res) => {
  const client = await connectToDB();
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
router.post('/', async (req, res) => {
  const client = await connectToDB();
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
router.get('/:id/messages', async (req, res) => {
  const client = await connectToDB();
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
router.patch('/:id/read', async (req, res) => {
  const client = await connectToDB();
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

// PATCH, update conversations last message
router.patch('/:id/lastMessage', async (req, res) => {
  const client = await connectToDB();
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


export default router;