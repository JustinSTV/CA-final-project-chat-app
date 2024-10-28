import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext, { UserContextTypes } from "../../context/UserContext";

import styled from "styled-components";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  padding: 50px 0;

  > img {
    object-fit: cover;
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  >button{
    cursor: pointer;
    padding: 15px 40px;
    border-radius: 5px;
    border: none;
    background-color: #1446A3;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
`;

const SpecificUserProfile = () => {

  const { username } = useParams<{ username: string }>();
  const { users, loggedInUser } = useContext(UserContext) as UserContextTypes;
  const navigate = useNavigate();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return <p>User not found</p>;
  }

  const handleStartChat = async () => {
    console.log("Starting chat with user:", user.username);
    console.log("logged in user: ", loggedInUser?.username);
  };

  return (
    <StyledSection>
      <img src={user.profileImage} alt={`${user.username}`} />
      <h2>{user.username}</h2>
      <button onClick={handleStartChat}>Start Chat</button>
    </StyledSection>
  );
}
 
export default SpecificUserProfile;