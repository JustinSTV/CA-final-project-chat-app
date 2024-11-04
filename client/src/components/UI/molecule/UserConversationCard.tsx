import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ConverstationContext, { ConversationWithUserType, ConversationContextTypes } from "../../../context/ConverstationContext"
import styled from "styled-components";

type Props = {
  loading: boolean;
  conversations: ConversationWithUserType[];
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  >div{
    cursor: pointer;
    background-color: #676765;
    border-radius: 10px;
    color: white;
    height: 100px;
    width: 300px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;

    > img {
      object-fit: cover;
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
    > .notification-bubble {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      background-color: red;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;

const UserConversationCard = ({loading, conversations}: Props) => {
  const navigate = useNavigate();
  const { markConversationAsRead } = useContext(ConverstationContext) as ConversationContextTypes;

  const handleConvoNav = async (id: string) => {
    await markConversationAsRead(id);
    navigate(`chat/${id}`)
  }

  return (
    <StyledDiv>
      {
      loading ? (
        <p>Loading conversations...</p>
      ) : conversations && conversations.length > 0 ? (
        conversations.map(convos => 
          convos.otherUserDetails ? (
            <div key={convos._id} onClick={() => handleConvoNav(convos._id)}>
              <img src={convos.otherUserDetails.profileImage} alt={convos.otherUserDetails.username} />
              <p>{convos.otherUserDetails.username}</p>
              {convos.unreadMessages > 0 && (
                <div className="notification-bubble">
                  {convos.unreadMessages}
                </div>
              )}
            </div>
          ) : null
        )
      ) : (
        <p>No recent conversations</p>
      )
    }
    </StyledDiv>
  );
}
 
export default UserConversationCard;