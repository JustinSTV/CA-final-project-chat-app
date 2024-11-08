import { useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { CiMenuBurger } from "react-icons/ci";

import UserContext, {UserContextTypes} from "../../../context/UserContext";
import ConverstationContext, {ConversationContextTypes} from "../../../context/ConverstationContext";
import UserConversationCard from "../molecule/UserConversationCard";

const StyledHeader = styled.header<{ isExpanded: boolean }>`
  color: white;
  height: 100vh;
  width: ${({ isExpanded }) => (isExpanded ? '100%' : '100px')};
  background-color: #292928;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;
  z-index: 100;
  top: 0;
  left: 0;
  position: ${({ isExpanded }) => (isExpanded ? 'fixed' : 'relative')};

  > .toggleBtn {
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
        display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
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
      display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
    }
  }

  @media (min-width: 1025px) {
    width: 100%;
    position: relative;
    left: 0;
    transition: none;
    > .toggleBtn {
      display: none;
    }
  }
`

const Overlay = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
  z-index: 9;

  @media (min-width: 1025px) {
    display: none;
  }
`

const Header = ({ isExpanded, setIsExpanded }: { isExpanded: boolean, setIsExpanded: (isExpanded: boolean) => void }) => {
  const navigate = useNavigate();
  const { loggedInUser, logOut } = useContext(UserContext) as UserContextTypes;
  const { conversations, fetchConversations, loading } = useContext(ConverstationContext) as ConversationContextTypes;

  useEffect(() => {
    if (loggedInUser) {
      fetchConversations(loggedInUser._id)
    }
    
    const handleResize = () => {
      if (window.innerWidth >= 1025) {
        setIsExpanded(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [loggedInUser]);

  const toggleHeader = () => {
    if (window.innerWidth < 1025) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
    <Overlay isExpanded={isExpanded} onClick={toggleHeader} />
    <StyledHeader isExpanded={isExpanded}>
      <CiMenuBurger className="toggleBtn" onClick={toggleHeader} />
      <div className="logo">
        <h1>You <span>Chat</span></h1>
      </div>
      <div className="allUsersBtn">
        <button onClick={() => navigate('/users')}>All users</button>
      </div>
      <div className="recentConvos">
        <h3>Recent conversations</h3>
        <UserConversationCard 
          loading={loading}
          conversations={conversations}
          isExpanded={isExpanded}
        />
      </div>
      <div className="profileSection">
        {loggedInUser && (
          <div onClick={() => navigate(`/profile/${loggedInUser.username}`)}>
            <img src={loggedInUser.profileImage} alt={loggedInUser.username} />
            <p>{loggedInUser.username}</p>
          </div>
        )}
        <button onClick={() => logOut()}>Logout</button>
      </div>
    </StyledHeader>
  </>
  );
}
 
export default Header;