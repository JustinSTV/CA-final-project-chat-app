import styled from "styled-components";
import { useContext } from "react";
import UserContext, {UserContextTypes} from "../../../context/UserContext";
import UserCard from "../molecule/UserCard";

const StyledHeader = styled.header`
  height: 100vh;
  width: 30%;
  background-color: #292928;

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
`

const Header = () => {

  const {users} = useContext(UserContext) as UserContextTypes;

  return (
    <StyledHeader>
      <div className="logo">
        <h1>You <span>Chat</span></h1>
      </div>
      <div className="allUserBtn">
        <button>All users</button>
      </div>
      <div className="recentConvos">
        {
          users.map(user => (
            <UserCard key={user._id} user={user} />
          ))
        }
      </div>
      <div className="profileSection"></div>
    </StyledHeader>
  );
}
 
export default Header;