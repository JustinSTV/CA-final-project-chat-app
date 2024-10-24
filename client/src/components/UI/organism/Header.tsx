import styled from "styled-components";
import { useContext } from "react";
import UserContext, {UserContextTypes} from "../../../context/UserContext";
import UserCard from "../molecule/UserCard";

const StyledHeader = styled.header`
  color: white;
  height: 100vh;
  width: 30%;
  background-color: #292928;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  >div.logo{
    margin: 50px 0;
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
    display: flex;
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
    overflow-y: auto;
    width: 100%;
    >h3{
      text-align: center;
      margin: 10px;
    }
    >div.recentUsers{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }

  >div.profileSection{
    height: 10%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 20px;
    >img{
      object-fit: cover;
      border-radius: 50%;
      width: 50px;
      height: 50px;
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
    }
  }
`

const Header = () => {

  const {users, loggedInUser} = useContext(UserContext) as UserContextTypes;

  return (
    <StyledHeader>
      <div className="logo">
        <h1>You <span>Chat</span></h1>
      </div>
      <div className="allUsersBtn">
        <button>All users</button>
      </div>
      <div className="recentConvos">
        <h3>Recent converstaions</h3>
        <div className="recentUsers">
          {
            users.map(user => (
              <UserCard key={user._id} user={user} />
            ))
          }
        </div>
      </div>
      <div className="profileSection">
        <img src={loggedInUser?.profileImage} alt={loggedInUser?.username} />
        <p>{loggedInUser?.username}</p>
        <button>Logout</button>
      </div>
    </StyledHeader>
  );
}
 
export default Header;