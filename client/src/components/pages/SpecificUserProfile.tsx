import { useParams } from "react-router-dom";
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
  const { users } = useContext(UserContext) as UserContextTypes;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <StyledSection>
      <img src={user.profileImage} alt={`${user.username}`} />
      <h2>{user.username}</h2>
      <button>Start Chat</button>
    </StyledSection>
  );
}
 
export default SpecificUserProfile;