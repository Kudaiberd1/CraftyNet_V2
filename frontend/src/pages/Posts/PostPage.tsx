import { useContext, useEffect, useState } from "react";
import type { Post } from "../Menu/Home";
import api from "../../services/api";
import { Link, useParams } from "react-router-dom";
import OnlyNavBar from "../Menu/onlyNavBar";
import formatDates from "../../services/formatData";
import { AuthContext } from "../../App";

interface User {
  id: number;
  username: string;
}

interface Comment {
  id: number;
  sender: User;
  resiever: number;
  parent: number;
  content: string;
  created_at: string;
  replies: Comment[];
}

const PostPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [post, setPost] = useState<Post>();
  const id = useParams<{ pk: string }>();
  const [comments, setComments] = useState<Comment[]>();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    api
      .get(`/api/posts/${id.pk}/`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
    api
      .get(`/api/posts/${id.pk}/comments/`)
      .then((res) => {
        setComments(res.data);
        console.log(res.data, "comment");
      })
      .catch((err) => alert(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/posts/${id.pk}/comments/`, {
        content: newComment,
        parent: null,
      });
      setNewComment("");
      const res = await api.get(`/api/posts/${id.pk}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async (pk: number) => {
    try {
      await api.delete(`/api/posts/${id.pk}/comments/`, {
        data: { id: pk },
      });
      const res = await api.get(`/api/posts/${id.pk}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <OnlyNavBar />
      <div className="p-4 pt-25">
        <div className="max-w-5xl items-center mx-auto">
          <div className="shadow-lg p-5 w-full rounded">
            <h1 className="text-center font-semibold text-2xl pt-5">
              {" "}
              {post?.title}{" "}
            </h1>
            <img src={post?.photo} className="pt-5" />
            {post?.about && (
              <p
                className="py-5"
                dangerouslySetInnerHTML={{ __html: post.about }}
              />
            )}

            {post?.post && (
              <div
                className="pb-10 text-base"
                dangerouslySetInnerHTML={{ __html: post.post }}
              />
            )}
            <p className="text-right text-sm text-gray-600">
              {" "}
              <span className="text-blue-500">
                <Link to={`/users/${post?.profile.username}`}>
                  @{post?.profile.username}
                </Link>
              </span>{" "}
              Published: {formatDates(post?.time)}{" "}
            </p>
          </div>
          <div className="shadow-lg p-5 w-full rounded mt-10">
            <div className="p-5">
              <div>
                {comments?.map((comment) => (
                  <>
                    <div className="ml-5 pl-4 mt-2" key={comment.id}>
                      <div className="flex justify-between">
                        <p>
                          <span className="font-bold">
                            <Link to={`/users/${comment.sender.username}`}>
                              {comment.sender.username}{" "}
                            </Link>
                          </span>{" "}
                          <span className="text-gray-500">
                            {" "}
                            {new Date(comment.created_at)
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                              .replace(",", "")}{" "}
                          </span>{" "}
                        </p>
                        {currentUser.username == comment.sender.username && (
                          <p>
                            <button
                              onClick={() => handleClick(comment.id)}
                              className="text-red-500 text-sm"
                            >
                              {" "}
                              Delete{" "}
                            </button>
                          </p>
                        )}
                      </div>
                      <p className="font-sans text-gray-900 text-sm">
                        {" "}
                        {comment.content}{" "}
                      </p>
                      <div className="ml-5 pl-4 border-l-2 border-gray-300 mt-3 bg-gray-100 rounded">
                        {comment.replies.map((reply) => (
                          <>
                            <p>
                              <span className="font-bold">
                                {" "}
                                <Link to={`/users/${reply.sender.username}`}>
                                  {reply.sender.username}
                                </Link>{" "}
                              </span>{" "}
                              <span className="text-gray-500">
                                {" "}
                                {new Date(reply.created_at)
                                  .toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })
                                  .replace(",", "")}{" "}
                              </span>{" "}
                            </p>
                            <p className="font-sans text-gray-900 text-sm">
                              {" "}
                              {reply.content}{" "}
                            </p>
                          </>
                        ))}
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div className="ml-4">
                <form onSubmit={handleSubmit}>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-700"
                  />
                  <button
                    type="submit"
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md transition"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
