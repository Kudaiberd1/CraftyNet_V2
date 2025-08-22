import { useContext, useState } from "react";
import { userContext } from "../../App";
import SideBar from "../Menu/NavBar";
import { UserCard } from "./UserCard";

const Profiles = () => {
  const { users } = useContext(userContext);

  // keep track of who you follow (mock state for now)
  const [following, setFollowing] = useState<number[]>([]);

  const toggleFollow = (userId: number) => {
    if (following.includes(userId)) {
      setFollowing(following.filter((id) => id !== userId)); // unfollow
    } else {
      setFollowing([...following, userId]); // follow
    }
  };

  return (
    <>
      <SideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 md-14 mt-14">
          {users.map((user) => (
            <UserCard user={user} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Profiles;
