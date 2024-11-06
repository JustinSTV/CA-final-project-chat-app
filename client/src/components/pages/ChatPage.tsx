import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext, { UserContextTypes, UserType } from "../../context/UserContext";
import MessageContext, { MessageContextTypes, MessageWithUserType } from "../../context/MessageContext";
import { useFormik } from "formik";
import styled from "styled-components";
import UserChatCard from "../UI/molecule/UserChatCard";
import ConverstationContext, { ConversationContextTypes } from "../../context/ConverstationContext";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  color: white;

  >div.messages{
    width: 100%;
    height: 75vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 15px;
  }
  >::-webkit-scrollbar {
    width: 12px;
    background-color: #F5F5F5;
    border-radius: 10px;
  }

  >::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #292928;
  }

  >::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #676765;
  }

  >::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  >form{
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 600px;

    >textarea{
      flex: 1;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      resize: none;
      font-family: "Figtree", sans-serif;
    }

    
    >button {
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
      background-color: #1446A3;
      color: white;
      cursor: pointer;
    }
  }

  @media (min-width: 481px) and (max-width: 767px) {
    width: 100%;
  }
`;

const ChatHeader = styled.header`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0 20px;

  > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  > h2 {
    font-size: 20px;
    color: white;
  }
`;


const ChatPage = () => {

  const { conversationId } = useParams<{ conversationId: string }>();
  const { users, loggedInUser } = useContext(UserContext) as UserContextTypes;
  const { messages, fetchMessages, addMessage } = useContext(MessageContext) as MessageContextTypes;
  const { getConversation } = useContext(ConverstationContext) as ConversationContextTypes;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [receiver, setReceiver] = useState<UserType | null>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      const currentConversation = getConversation(conversationId);

      if (currentConversation) {
        const otherParticipantId = currentConversation.participants.find(id => id !== loggedInUser?._id);
        const otherUser = users.find(user => user._id === otherParticipantId);
        setReceiver(otherUser || null);
      }
    }
  }, [conversationId, loggedInUser, users]);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formik = useFormik({
    initialValues: {
      newMessage: ""
    },
    onSubmit: async (values, { resetForm }) => {
      if (values.newMessage && loggedInUser && conversationId) {
        await addMessage({
          conversationId,
          senderId: loggedInUser._id,
          content: values.newMessage,
          createdAt: new Date().toISOString(),
          likes: []
        });
        resetForm();
      }
    }
  });

  return (
    <StyledSection>
      {receiver ? (
        <ChatHeader>
          <img src={receiver.profileImage} alt={receiver.username} />
          <h2>{receiver.username}</h2>
        </ChatHeader>
      ) : (
        <p>Loading conversation...</p>
      )}
      {
        messages.length ? (
          <div className="messages">
          {messages.map((message: MessageWithUserType) => (
            <UserChatCard 
              key={message._id} 
              message={message} 
              loggedInUser={loggedInUser} 
            />
          ))}
          <div ref={messagesEndRef}/>
        </div>
        ) : (
          <>
            <p>No messages with this user</p>
          </>
        )
      }
      <form onSubmit={formik.handleSubmit}>
        <textarea
        name="newMessage"
          value={formik.values.newMessage} 
          onChange={formik.handleChange} 
          placeholder="Type a message" 
        />
        <button type="submit">Send</button>
      </form>
  </StyledSection>
  );
}
 
export default ChatPage;