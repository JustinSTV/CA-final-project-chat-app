// import { useParams } from "react-router-dom";
import { useContext } from "react";
import styled from "styled-components";

import UserContext, {UserContextTypes} from "../../context/UserContext";

const StyledSection = styled.section`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;

  >h2{
    margin-top: 50px;
  }

  >div.profilePic{
    display: flex;
    align-items: center;
    gap: 10px;

    >img{
      height: 200px;
      width: 200px;
      border-radius: 50%;
      object-fit: cover;
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
  }

  >div.usernameAndPassword{
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    >div{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      >form{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        >div >input{
          border: none;
          outline: none;
          border-radius: 5px;
          padding: 10px 20px;
        }

        >input[type="submit"]{
          cursor: pointer;
          padding: 15px 30px;
          margin: 10px;
          border-radius: 5px;
          border: none;
          background-color: #1446A3;
          font-size: 14px;
          color: white;
          font-weight: bold;
        }
      }
    }
  }
`

const UserProfile = () => {

  const {loggedInUser} = useContext(UserContext) as UserContextTypes;
  console.log(loggedInUser)

  return (
    <StyledSection>
      <h2>Settings</h2>
      <div className="profilePic">
        <img src={loggedInUser?.profileImage} alt={loggedInUser?.username} />
        <button>Change Profile Picture</button>
      </div>
      <div className="usernameAndPassword">
        <div className="username">
          <h3>Change username</h3>
          <form action="">
            <div>
              <input 
                type="text" 
                placeholder="Change Username"
              />
            </div>
            <input type="submit" value="Change username" />
          </form>
        </div>
        <div className="password">
          <h3>Change Password</h3>
          <form action="">
            <div>
              <input 
                type="password" 
                placeholder="Old Password"
              />
            </div>
            <div>
              <input 
                type="password"
                placeholder="New Password"
              />
            </div>
            <div>
              <input 
                type="password"
                placeholder="Repeat New Password"
              />
            </div>
            <input type="submit" value="Change password" />
          </form>
        </div>
      </div>
    </StyledSection>
  );
}
 
export default UserProfile;