import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { CiMenuBurger } from "react-icons/ci";

import UserContext, {UserContextTypes} from "../../../context/UserContext";
import ConverstationContext, {ConversationContextTypes} from "../../../context/ConverstationContext";
import UserConversationCard from "../molecule/UserConversationCard";

const StyledHeader = styled.header<{ isExpanded: boolean }>`
  color: white;
  height: 100vh;
  width: ${({ isExpanded }) => (isExpanded ? '30%' : '60px')};
  background-color: #292928;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;
  position: ${({ isExpanded }) => (isExpanded ? 'fixed' : 'relative')};
  z-index: ${({ isExpanded }) => (isExpanded ? 10 : 1)};

  > .toggleBtn {
    /* margin: 20px auto; */
    margin: ${({ isExpanded }) => (isExpanded ? '10px auto' : '10px auto')};
    cursor: pointer;
    z-index: 11;
    font-size: 24px;
  }

  >div.logo{
    margin: 50px 0;
    display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
    >h1{
      text-align: center;
      color: white;
      >span{
        background-color: #1446A3;
        padding: 10px 15px;
        border-radius: 10px;
      }
    }
  }

  >div.allUsersBtn{
    margin-bottom: 10px;
    display: ${({ isExpanded }) => (isExpanded ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
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
  }

  >div.recentConvos{
    flex-grow: 1;
    overflow-x: ${({ isExpanded }) => (isExpanded ? 'auto' : 'none')};
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    >h3{
      text-align: center;
      margin: 10px;
      display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
    }
  }

  >div.profileSection{
    border-top: 3px solid #3C3C3B;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ isExpanded }) => (isExpanded ? '0 20px': '0')};
    >div{
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      >img{
        object-fit: cover;
        border-radius: 50%;
        width: 50px;
        height: 50px;
      }
      >p{
        display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')}; /* Show username only when expanded */
      }
    }
    >button{
      margin-left: auto;
      cursor: pointer;
      padding: 15px 30px;
      border-radius: 5px;
      border: none;
      background-color: #1446A3;
      font-size: 14px;
      color: white;
      display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')}; //Show logout only when expanded
    }
  }

  > .allUsersBtn,
  > .recentConvos,
  > .profileSection {
    display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
  }

  @media (min-width: 700px) {
    width: ${({ isExpanded }) => (isExpanded ? '40%' : '70px')};
    overflow: hidden;
  }
`

const Header = () => {
  const navigate = useNavigate();
  const { loggedInUser, logOut } = useContext(UserContext) as UserContextTypes;
  const { conversations, fetchConversations, loading } = useContext(ConverstationContext) as ConversationContextTypes;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      fetchConversations(loggedInUser._id)
    }
  }, [loggedInUser]);

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <StyledHeader isExpanded={isExpanded}>
      <CiMenuBurger className="toggleBtn" onClick={toggleHeader} />
      <div className="logo">
        <h1>You <span>Chat</span></h1>
      </div>
      <div className="allUsersBtn">
        <button onClick={() => navigate('/users')}>All users</button>
      </div>
      <div className="recentConvos">
        <h3>Recent converstaions</h3>
        <UserConversationCard 
          loading={loading}
          conversations={conversations}
          isExpanded={isExpanded}
        />
      </div>
      <div className="profileSection">
        {
          loggedInUser && (
            <div onClick={() => navigate(`/profile/${loggedInUser.username}`)}>
              <img src={loggedInUser.profileImage} alt={loggedInUser.username} />
              <p>{loggedInUser.username}</p>
            </div>
          )
        }
        <button onClick={() => logOut()}>Logout</button>
      </div>
    </StyledHeader>
  );
}
 
export default Header;