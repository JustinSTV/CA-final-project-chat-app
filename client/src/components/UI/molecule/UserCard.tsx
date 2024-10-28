import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext, { UserContextTypes, UserType } from "../../../context/UserContext";

const StyledDiv = styled.div<{ isCurrentUser: boolean }>`
  background-color: #676765;
  border-radius: 10px;
  color: white;
  height: 100px;
  width: 300px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: ${({ isCurrentUser }) => (isCurrentUser ? "" : "pointer")};
  opacity: ${({ isCurrentUser }) => (isCurrentUser ? 0.5 : 1)};

  >img{
    object-fit: cover;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
`

const UserCard = ({user}: {user: UserType}) => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(UserContext) as UserContextTypes;

  const isCurrentUser = loggedInUser?.username === user.username;

  const handleClick = () => {
    if (!isCurrentUser) {
      navigate(`/user/${user.username}`);
    }
  };

  return (
    <StyledDiv onClick={handleClick} isCurrentUser={isCurrentUser}>
      <img src={user.profileImage} alt={`${user.username}`} />
      <p>{user.username}</p>
    </StyledDiv>
  );
}
 
export default UserCard;