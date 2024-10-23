import { useContext} from "react";
import UserContext, { UserContextTypes, UserType } from "../../context/UserContext";

const MainPage = () => {

  const {users} = useContext(UserContext) as UserContextTypes;

  return (
    <section>
      <h1>Chat page</h1>
      {
        users.map((user: UserType) => (
          <div key={user._id}>
            <img src={user.profileImage} alt={`${user.username}`} />
            <p>{user.username}</p>
          </div>
        ))
      }
    </section>
  );
}
 
export default MainPage;