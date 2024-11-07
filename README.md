# "YouChat" Chat application

Full-stack chat application built with React, TypeScript, and Vite on the client-side, and Express with MongoDB on the server-side. The application allows users to register, log in, update their profile, view all users, start conversations, and send messages.

## Features
- User Registration and Login
- Profile Management (Update username, password, and profile picture)
- View all users
- Start conversations with other users
- Send and receive messages
- Like messages
- View recent conversations
- Delete conversations

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/JustinSTV/CA-final-project-chat-app.git
```

2. Navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```

3. Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

**Set up ENV file Variables**

Create `.env` file in the `server` directory with the following content:

```ini
SERVER_PORT = 5500
FRONT_PORT = 5173

DB_USER=<your-db-user>
DB_USER_PASSWORD=<your-db-password>
DB_CLUSTER_NAME=<your-db-cluster-name>
DB_CLUSTER_ID=<your-db-cluster-id>
```
***Logins will be sent separately***

## Running the Application

You'll need two terminals for `server` and `client` sides

1. Start `server` side:
```bash
cd server
npm run dev
```

2. Start `client` side:
```bash
cd client
npm run dev
```

By default `client` side should run at `http://localhost:5173`

## API Endpoints

#### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user by ID
- `POST /users` - Create a new user
- `POST /users/login` - Log in a user
- `PATCH /users/:id/username` - Update a user's username
- `PATCH /users/:id/password` - Update a user's password
- `PATCH /users/:id/profileImage` - Update a user's profile picture

#### Conversations
- `GET /conversations/:userId` - Get all conversations for a user
- `POST /conversations` - Create a new conversation
- `DELETE /conversations/:id` - Delete a conversation by ID
- `PATCH /conversations/:id/read` - Mark a conversation as read
- `PATCH /conversations/:id/lastMessage` - Update the last message in a conversation

#### Messages
- `GET /conversations/:id/messages` - Get all messages for a conversation
- `POST /messages` - Send a new message
- `PATCH /messages/:id/like` - Like a message

## Technologies Used
- **Front-end**: React, TypeScript, Vite, Styled-Components, Formik, Yup, React Router
- **Back-end**: Express, MongoDB, Mongoose, bcrypt, uuid, dotenv