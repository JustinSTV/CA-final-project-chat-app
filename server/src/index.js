import "dotenv/config";
import express from "express";
import cors from "cors";
import { v4 as generateID } from "uuid";
import bodyParser from "body-parser";
import path from 'path'
import { fileURLToPath } from 'url'

import userRoutes from './routes/userRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import messageRoute from './routes/messageRoutes.js'

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
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoute);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
