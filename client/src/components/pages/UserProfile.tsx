import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { username } = useParams()

  return (
    <section>
      <h1>profile of {username}</h1>
      user profile
    </section>
  );
}
 
export default UserProfile;