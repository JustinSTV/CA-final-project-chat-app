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
      display: flex;
      align-items: center;
      background-color: #444;
      padding: 10px;
      border-radius: 10px;
      max-width: 80%;
      position: relative;

      >img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        object-fit: cover;
      }
      >div.message-content{
        display: flex;
        flex-direction: column;
        >span{
          font-size: 14px;
          font-weight: bold;
          color: #aaa;
          margin-bottom: 5px;
        }
        >p{
          font-size: 16px;
          color: white;
        }
        >span.timestamp {
          font-size: 12px;
          color: #bbb;
          align-self: flex-end;
          margin-top: 5px;
        }
      }
    }
    >div.sender{
      align-self: flex-end;
      background-color: #1446A3;
      max-width: 80%;
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
  }, []);

  return (
    <StyledSection>
    <div className="messages">
      {messages.map((message: MessageWithUserType) => (
        <div 
          key={message._id} 
          className={`message ${message.senderId === loggedInUser?._id ? 'sender' : ''}`}
        >
          <img 
            src={message.senderDetails.profileImage} 
            alt={message.senderDetails.username} 
            className="profile-pic" 
          />
          <div className="message-content">
            <span>{message.senderDetails.username}</span>
            <p>{message.content}</p>
            <span className="timestamp">{message.createdAt}</span>
          </div>
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