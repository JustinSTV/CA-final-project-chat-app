import { useContext} from "react";
import UserContext, { UserContextTypes, UserType } from "../../context/UserContext";

const MainPage = () => {

  const {users} = useContext(UserContext) as UserContextTypes;

  return (
    <section>
      <h1>Chat page</h1>
    </section>
  );
}
 
export default MainPage;