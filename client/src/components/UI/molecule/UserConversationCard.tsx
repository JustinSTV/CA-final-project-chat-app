import { useNavigate } from "react-router-dom";
import { ConversationWithUserType } from "../../../context/ConverstationContext"
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
    border: 1px solid white;
  }
`;

const UserConversationCard = ({loading, conversations}: Props) => {
  const navigate = useNavigate();
  console.log(conversations)

  const handleConvoNav = (id: string) => {
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
              {convos.otherUserDetails.username}
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