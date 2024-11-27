import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'

import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoute from './routes/messageRoutes.js'
import { connectToDB } from "./MongoClient.js";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.SERVER_PORT;

const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`,
};

app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

//image
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/public')));

app.use('/users', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoute);

let mongoClient

const startServer = async () => {
  try {
    await connectToDB();
    console.log("MongoDB connection established, starting server...");

    httpServer.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`)
    });

    const io = new Server(httpServer, {
      cors: {
        origin: `http://localhost:${process.env.FRONT_PORT}`
      }
    });

    io.on('connection', (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("message", (msg) => {
        console.log("message: " + JSON.stringify(msg));
        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    })

  } catch (err) {
    console.error("Failed to connect to MongoDB: ", err);
  }
};

startServer();
