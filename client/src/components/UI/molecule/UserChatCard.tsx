import { useContext } from "react";
import MessageContext ,{ MessageContextTypes, MessageWithUserType } from "../../../context/MessageContext";
import { UserType } from "../../../context/UserContext";
import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";
import { FaHeart } from "react-icons/fa";

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #444;
  padding: 10px;
  border-radius: 10px;
  max-width: 450px;
  position: relative;

  &.sender {
    align-self: flex-end;
    background-color: #1446A3;
  }

  > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  > .message-content {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    overflow: hidden;

    > span {
      font-size: 14px;
      font-weight: bold;
      color: #aaa;
      margin-bottom: 5px;
    }

    > p {
      font-size: 16px;
      color: white;
      word-wrap: break-word;
    }

    > .timestamp {
      font-size: 12px;
      color: #bbb;
      align-self: flex-end;
      margin-top: 5px;
    }
  }
  > .like-button {
    cursor: pointer;
    margin-left: auto;
    font-size: 16px;
    flex-shrink: 0;
  }
  > .like-button.liked {
    color: red;
  }

  > .like-button.sender-liked {
    color: red;
  }

  @media (max-width: 480px){
    &.sender{
      max-width: 300px;
    }
  }

  @media (min-width: 481px) and (max-width: 767px) {
    max-width: 300px;
  }
`;

type UserChatCardProps = {
  message: MessageWithUserType;
  loggedInUser: UserType | null;
};

const UserChatCard = ({ message, loggedInUser }: UserChatCardProps) => {

  const { likeMessage } = useContext(MessageContext) as MessageContextTypes;

  const handleLike = async () => {
    if (loggedInUser && message.senderId !== loggedInUser._id) {
      //? checking if message is already liked
      const isLiked = message.likes.includes(loggedInUser._id);
      await likeMessage(message._id, loggedInUser._id, isLiked);
    }
  };

  //? ar jau uzdetas like
  const likedByLoggedInUser = message.likes.includes(loggedInUser?._id || "");
  //? ar žinute iš prisijungusio userio
  const messageFromLoggedInUser = message.senderId === loggedInUser?._id;

  return (
    <StyledMessage className={`message ${message.senderId === loggedInUser?._id ? 'sender' : ''}`} >
      {messageFromLoggedInUser && message.likes.length > 0 && (
        <FaHeart className="like-button sender-liked" />
      )}
      <img 
        src={message.senderDetails.profileImage} 
        alt={message.senderDetails.username} 
        className="profile-pic" 
      />
      <div className="message-content">
        <span>{message.senderDetails.username}</span>
        <p>{message.content}</p>
        <span className="timestamp">
          {`Sent ${formatDistanceToNow(new Date(message.createdAt))} ago`}
        </span>
      </div>
      {!messageFromLoggedInUser && (
        <FaHeart 
        className={`like-button ${likedByLoggedInUser ? 'liked' : ''}`}
          onClick={handleLike}
        />
      )}
    </StyledMessage>
  );
};

export default UserChatCard;