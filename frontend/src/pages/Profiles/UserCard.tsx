import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../App";
import default_image from "../../assets/default.png";
import { getCountryName } from "../../services/constants";
import api from "../../services/api";
import { CreateFollow, Unfollow } from "../Follow/Follow";

export const UserCard = ({ user }: { user: User }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [currentUser, setCurentUser] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/users/followers/${user.username}/`).then((res) => {
      // Convert ["Kudaiberdi"] → [{ username: "Kudaiberdi" }]
      const formatted = res.data.map((u: string) => ({ username: u }));
      setFollowers(formatted);
      console.log(formatted, "Followers formatted rfjmfrj");
    });
    api.get("/api/profiles/my/").then((res) => {
      setCurentUser(res.data);
      console.log(res.data);
    });
  }, []);

  const toggleFollow = () => {
    if (isFollowing == true) {
      Unfollow(user.username);
    } else {
      CreateFollow(user.username);
    }
    setIsFollowing((prev) => !prev);
  };

  useEffect(() => {
    if (
      currentUser &&
      followers.some((f) => f.username === currentUser.username)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [followers, currentUser]);

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-md transition mb-6">
      <div className="flex items-center gap-4">
        <Link to={`/users/${user.username}`}>
          <img
            src={user.avatar || default_image}
            alt={user.username}
            className="w-14 h-14 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/users/${user.username}`}
            className="font-semibold text-gray-900 hover:underline"
          >
            {user.username}
          </Link>
          <p className="text-sm text-gray-500 truncate w-40"></p>
          <span className="text-sm text-gray-400">
            {getCountryName(user.country)}
          </span>
        </div>
      </div>
      {currentUser?.username != user.username && (
        <button
          onClick={currentUser && toggleFollow}
          className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
            isFollowing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};
