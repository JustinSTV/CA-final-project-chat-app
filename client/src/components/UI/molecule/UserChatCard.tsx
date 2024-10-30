import { MessageWithUserType } from "../../../context/MessageContext";
import { UserType } from "../../../context/UserContext";
import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: #444;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
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

    > span {
      font-size: 14px;
      font-weight: bold;
      color: #aaa;
      margin-bottom: 5px;
    }

    > p {
      font-size: 16px;
      color: white;
    }

    > .timestamp {
      font-size: 12px;
      color: #bbb;
      align-self: flex-end;
      margin-top: 5px;
    }
  }
`;

type UserChatCardProps = {
  message: MessageWithUserType;
  loggedInUser: UserType | null;
};

const UserChatCard = ({ message, loggedInUser }: UserChatCardProps) => {
  return (
    <StyledMessage className={`message ${message.senderId === loggedInUser?._id ? 'sender' : ''}`}>
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
    </StyledMessage>
  );
};

export default UserChatCard;