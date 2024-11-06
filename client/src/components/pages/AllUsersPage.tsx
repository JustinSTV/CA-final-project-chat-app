import { useContext } from "react";
import styled from "styled-components";
import UserContext, {UserContextTypes} from "../../context/UserContext";
import UserCard from "../UI/molecule/UserCard";

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  >h2{
    position: sticky;
    top: 0;
    color: white;
    margin: 20px;
  }
  >div.gridCon{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    place-items: center;
  }

  @media (min-width: 481px) and (max-width: 767px) {
    width: 100%;
  }
`

const AllUsersPage = () => {

  const {users} = useContext(UserContext) as UserContextTypes;

  return (
    <StyledSection>
      <h2>Users</h2>
      <div className="gridCon">
        {
          users.map(user => (
            <UserCard key={user._id} user={user} />
          ))
        }
      </div>
    </StyledSection>
  );
}
 
export default AllUsersPage;