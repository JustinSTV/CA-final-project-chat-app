import { Router } from 'express';
import bcrypt from "bcrypt";
import { v4 as generateID } from "uuid";

import { connectToDB } from '../MongoClient.js';


const router = Router();

router.get('/', async (req, res) => {
  const client = await connectToDB();
  try {
    const data = await client
      .db("chat_app")
      .collection("users")
      .find()
      .toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err });
    console.error("getting users:", err)
  } finally {
    if (client) {
      client.close();
    }
  }
})

// GET, fetch a specific user by ID
router.get('/:id', async (req, res) => {
  const client = await connectToDB();
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
  const client = await connectToDB();
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
router.post("/", checkUniqueUser, async (req, res) => {
  const client = await connectToDB();
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
router.post("/login", async (req, res) => {
  const client = await connectToDB();
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
    console.error('logging in error:', err)
  } finally{
    client.close();
  }
})

// PATCH, edit users username
router.patch('/:id/username', async (req, res) => {
  const client = await connectToDB();
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
router.patch('/:id/password', async (req, res) => {
  const client = await connectToDB();
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
router.patch('/:id/profileImage', async (req, res) => {
  const client = await connectToDB();
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

export default router;