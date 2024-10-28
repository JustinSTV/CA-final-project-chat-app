import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext, { UserContextTypes, UserType } from "../../../context/UserContext";

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

  > img {
    object-fit: cover;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  &.disabled{
    opacity: 0.5;
  }
`;

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
    <StyledDiv onClick={handleClick} className={isCurrentUser ? "disabled" : ""}>
      <img src={user.profileImage} alt={`${user.username}`} />
      <p>{user.username}</p>
    </StyledDiv>
  );
}
 
export default UserCard;