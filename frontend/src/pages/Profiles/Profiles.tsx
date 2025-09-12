import { useContext, useState } from "react";
import { userContext } from "../../App";
import SideBar from "../Menu/NavBar";
import { UserCard } from "./UserCard";

const Profiles = () => {
  const { users } = useContext(userContext);

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
