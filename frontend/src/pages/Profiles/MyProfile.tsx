import SideBar from "../Menu/NavBar";
import default_image from "../../assets/default.png";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { getCountryName } from "../../services/constants";
import formatDates, { getSiteName } from "../../services/formatData";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../App";

const MyProfile = () => {
  const [profile, setProfile] = useState<User>();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/profiles/my/").then((res) => {
      setProfile(res.data), console.log(res.data);
    });
  }, []);

  return (
    <>
      <SideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <div className="items-center max-w-2xl my-4 mx-auto">
            <div className="flex ">
              <div className="relative w-28 h-28 group flip-card">
                <div className="flip-inner w-full h-full">
                  <img
                    className="w-full h-full rounded-full object-cover border border-gray-300"
                    src={profile?.avatar ? profile.avatar : default_image}
                    alt="Default avatar"
                  />
                </div>
              </div>
              <div className="px-5">
                <h1 className="text-3xl font-bold leading-tight">
                  {" "}
                  {profile?.first_name} {profile?.last_name}{" "}
                </h1>
                <p className="text-gray-500 text-lg"> @{profile?.username} </p>
                {profile?.bio ? (
                  <p className="leading-tight text-sm pb-5"> {profile.bio} </p>
                ) : (
                  <p className="pb-4"> </p>
                )}
                <div className="flex space-x-6">
                  <p>
                    {" "}
                    {profile?.posts.length}{" "}
                    <span className="text-sm text-gray-500">posts</span>
                  </p>
                  <p>
                    {" "}
                    0 <span className="text-sm text-gray-500">followers</span>
                  </p>
                  <p>
                    {" "}
                    0 <span className="text-sm text-gray-500">following</span>
                  </p>
                </div>
              </div>
            </div>
            <section className="flex space-x-4 mb-8 pt-8">
              <button
                className="flex-1 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition"
                onClick={() => navigate("/my/edit")}
              >
                {" "}
                Edit Profile
              </button>

              <button className="flex-1 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition">
                {" "}
                Share Profile{" "}
              </button>
            </section>
            <section className="flex space-x-6 text-gray-500 text-sm mb-8">
              <div className="flex space-x-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5h6a2 2 0 012 2v2H7V7a2 2 0 012-2zM3 9h18v11H3V9z"
                  />
                </svg>
                <span>
                  {profile?.username == "Kudaiberdi" ? "Admin" : "Author"}
                </span>
              </div>
              <div className="flex space-x-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDates(profile?.date_joined)}</span>
              </div>
              {profile?.social_link && (
                <a href={profile.social_link} target="_blank">
                  <div className="flex space-x-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 5" />
                      <path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.5a5 5 0 0 0 7.07 7.07L14 19" />
                    </svg>
                    <p> {getSiteName(profile.social_link)} </p>
                  </div>
                </a>
              )}
              <div className="flex space-x-1 items-center">
                {getCountryName(profile?.country)}
              </div>
            </section>
            <hr className="mb-8 border-gray-200" />
            <div>
              {profile?.posts?.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id}>
                  <div
                    key={post.id}
                    className="flex w-full rounded-lg shadow hover:shadow-lg mb-6 p-5 space-x-4"
                  >
                    <img
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      src={profile?.avatar ? profile.avatar : default_image}
                      alt="user avatar"
                    />
                    <div>
                      <p>
                        {" "}
                        <span className="font-bold">
                          {" "}
                          {profile?.first_name} {profile?.last_name}{" "}
                        </span>{" "}
                        <span className="text-gray-500">
                          @{profile?.username}
                        </span>{" "}
                        <span className="text-gray-400">
                          {" "}
                          {formatDates(post.time)}{" "}
                        </span>
                      </p>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: post.about }}
                      />
                      <div
                        className="pt-1 text-gray-900 text-base"
                        dangerouslySetInnerHTML={{ __html: post.post }}
                      />
                      <footer className="flex space-x-6 text-gray-500 text-sm mt-4">
                        <Link to={`/post/${post.id}`}>
                          <button className="flex items-center space-x-1 hover:text-red-500 transition cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a5.5 5.5 0 017.778 0L12 6.94l-.096-.096a5.5 5.5 0 017.778 7.778L12 21l-7.682-7.682a5.5 5.5 0 010-7.778z"
                              />
                            </svg>
                            <span>{post.likes.length}</span>
                          </button>
                        </Link>
                        <Link to={`/post/${post.id}`}>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"
                              />
                            </svg>
                            <span>0</span>
                          </button>
                        </Link>
                        <Link to={`/post/${post.id}/edit`}>
                          <button className="flex items-center space-x-1 hover:text-blue-500 transition cursor-pointer">
                            Edit
                          </button>
                        </Link>
                        <Link to={`/post/${post.id}/delete`}>
                          <button className="flex items-center space-x-1 hover:text-red-500 transition cursor-pointer">
                            Delete
                          </button>
                        </Link>
                      </footer>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
