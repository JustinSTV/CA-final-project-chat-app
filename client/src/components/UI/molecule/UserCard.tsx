import { useContext } from "react";
import styled from "styled-components";

import UserContext, {UserContextTypes, UserType} from "../../../context/UserContext";

const StyledDiv = styled.div`
  background-color: #676765;
  border-radius: 10px;
  color: white;
  height: 100px;
  width: 300px;
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