import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ConverstationContext, { ConversationWithUserType, ConversationContextTypes } from "../../../context/ConverstationContext"
import styled from "styled-components";

type Props = {
  loading: boolean;
  conversations: ConversationWithUserType[];
  isExpanded: boolean;
}

const StyledDiv = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  >div{
    cursor: pointer;
    background-color: ${({ isExpanded }) => (isExpanded ? '#676765' : 'transparent')};
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

  @media (min-width: 700px) {
    >p{
      display: none;
    }
    >div{
      width: 200px;
      display: flex;
      justify-content: center;
    }
  }
`;

const UserConversationCard = ({loading, conversations, isExpanded}: Props) => {
  const navigate = useNavigate();
  const { markConversationAsRead } = useContext(ConverstationContext) as ConversationContextTypes;

  const handleConvoNav = async (id: string) => {
    await markConversationAsRead(id);
    navigate(`chat/${id}`)
  }

  return (
    <StyledDiv isExpanded={isExpanded}>
      {
      loading ? (
        <p>Loading conversations...</p>
      ) : conversations && conversations.length > 0 ? (
        conversations.map(convos => 
          convos.otherUserDetails ? (
            <div key={convos._id} onClick={() => handleConvoNav(convos._id)}>
              <img src={convos.otherUserDetails.profileImage} alt={convos.otherUserDetails.username} />
              {isExpanded && <p>{convos.otherUserDetails.username}</p>}
              {isExpanded && convos.unreadMessages > 0 && (
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