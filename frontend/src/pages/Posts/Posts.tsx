import { useContext } from "react";
import { postContext } from "../../App";
import formatDates from "../../services/formatData";
import { Link } from "react-router-dom";
import default_image from "../../assets/default.png";

const Posts = () => {
  const { posts } = useContext(postContext);
  //console.log(posts);
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 mt-14">
        <div className="items-center max-w-2xl my-4 mx-auto">
          {posts.map((post) => (
            <Link to={`/post/${post.id}`}>
              <div
                className="flex space-x-4 shadow py-5 px-15 my-6 rounded hover:shadow-lg"
                key={post.id}
              >
                <img
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  src={post?.profile.avatar || default_image}
                  alt="user avatar"
                />
                <div>
                  <p className="">
                    <Link
                      to={`/users/${post.profile.username}`}
                      className="text-sm text-gray-500"
                    >
                      <span className="text-lg font-bold text-black">
                        {post.profile.first_name} {post.profile.last_name}
                      </span>
                      {"  "}@{post.profile.username}
                    </Link>{" "}
                    <span className="text-gray-400 text-sm ml-auto">
                      {formatDates(post.time)}
                    </span>
                  </p>
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: post.about }}
                  />
                  <div
                    className="mt-2 text-gray-900 text-base"
                    dangerouslySetInnerHTML={{ __html: post.post }}
                  />
                  <div className="flex items-center space-x-1 hover:text-red-500 transition cursor-pointer py-2">
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
                        <span>{post.comments_count}</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
