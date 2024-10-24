import { useContext } from "react";
import styled from "styled-components";

import UserContext, {UserContextTypes, UserType} from "../../../context/UserContext";

const StyledDiv = styled.div`
  border: white 1px solid;
  color: white;
  height: 100px;
  max-width: 400px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;

  >img{
    object-fit: cover;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
`

const UserCard = ({user}: {user: UserType}) => {

  return (
    <StyledDiv>
      <img src={user.profileImage} alt={`${user.username}`} />
      <p>{user.username}</p>
    </StyledDiv>
  );
}
 
export default UserCard;