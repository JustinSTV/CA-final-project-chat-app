import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserContext, { UserContextTypes } from "../../context/UserContext";
import MessageContext, { MessageContextTypes, MessageWithUserType } from "../../context/MessageContext";
import { useFormik } from "formik";
import styled from "styled-components";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  color: white;

  >div.messages{
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    >div.message{
      background-color: #444;
      padding: 10px;
      border-radius: 5px;
      align-self: flex-start;
    }
    >div.sender{
      align-self: flex-end;
      background-color: #1446A3;
    }
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
`;

const ChatPage = () => {

  const { conversationId } = useParams<{ conversationId: string }>();
  const { loggedInUser } = useContext(UserContext) as UserContextTypes;
  const { messages, fetchMessages, addMessage } = useContext(MessageContext) as MessageContextTypes;

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

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  return (
    <StyledSection>
    <div className="messages">
      {messages.map((message: MessageWithUserType) => (
        <div 
          key={message._id} 
          className={`message ${message.senderId === loggedInUser?._id ? 'sender' : ''}`}
        >
          <p>{message.content}</p>
          <span>{message.createdAt}</span>
          <p>{message.senderDetails.username}</p>
        </div>
      ))}
    </div>
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