import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserContext, { UserContextTypes } from "../../context/UserContext";
import MessageContext, { MessageContextTypes } from "../../context/MessageContext";
import styled from "styled-components";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  color: white;

`;

const ChatPage = () => {

  const { conversationId } = useParams<{ conversationId: string }>();
  const { loggedInUser } = useContext(UserContext) as UserContextTypes;
  const { messages, fetchMessages, addMessage } = useContext(MessageContext) as MessageContextTypes;
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && loggedInUser && conversationId) {
      await addMessage({
        conversationId,
        senderId: loggedInUser._id,
        content: newMessage,
        createdAt: new Date().toISOString(),
        likes: []
      });
      setNewMessage("");
    }
  };

  return (
    <StyledSection>
    <div className="messages">
      {messages.map(message => (
        <div key={message._id}>
          <p>{message.content}</p>
          <small>{message.createdAt}</small>
        </div>
      ))}
    </div>
    <form onSubmit={handleSendMessage}>
        <textarea
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message" 
        />
        <button type="submit">Send</button>
      </form>
  </StyledSection>
  );
}
 
export default ChatPage;