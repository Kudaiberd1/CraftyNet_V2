import { useEffect, useState } from "react";
import type { Post } from "../Menu/Home";
import api from "../../services/api";
import { Link, useParams } from "react-router-dom";
import OnlyNavBar from "../Menu/onlyNavBar";
import formatDates from "../../services/formatData";

const PostPage = () => {
  const [post, setPost] = useState<Post>();
  const id = useParams<{ pk: string }>();

  useEffect(() => {
    api
      .get(`/api/posts/${id.pk}/`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <OnlyNavBar />
      <div className="p-4 pt-25">
        <div className="flex max-w-5xl items-center mx-auto">
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
        </div>
      </div>
    </>
  );
};

export default PostPage;
