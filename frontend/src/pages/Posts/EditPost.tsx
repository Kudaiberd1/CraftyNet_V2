import { useEffect, useRef, useState } from "react";
import SideBar from "../Menu/NavBar";
import api from "../../services/api";
import type { Post } from "../Menu/Home";
import { useNavigate, useParams } from "react-router-dom";

export const DeletePost = () => {
  const navigate = useNavigate();
  const id = useParams<{ pk: string }>();

  const handleDelete = async () => {
    try {
      await api.delete(`/api/posts/${id.pk}/delete/`);
      alert("Successfully deleted");
      navigate("/my", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <SideBar />
      <div className="text-center mt-24">
        <p className="mb-2 text-lg font-semibold">
          Are you sure to delete this page?
        </p>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </>
  );
};

const EditPost = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [post, setPost] = useState<Post>();
  const id = useParams<{ pk: string }>();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPost({ ...post, photo: previewUrl });
      // Optionally, you may want to store the file for uploading later.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (post?.title) formData.append("title", post.title);
      if (post?.about) formData.append("about", post.about);
      if (post?.post) formData.append("post", post.post);
      if (selectedFile) formData.append("photo", selectedFile);

      await api.patch(`/api/posts/${id.pk}/update/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/post/${id.pk}`, { state: { refresh: true } });
    } catch (err) {
      if (err.status == 403) {
        alert("You can't change this post!");
      } else {
        alert(err);
      }
    }
  };

  useEffect(() => {
    api
      .get(`/api/posts/${id.pk}/`)
      .then((res) => setPost(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <SideBar />
      <div className="py-4 px-2 sm:ml-64">
        <div className="py-4 px-2 mt-14">
          <div className="items-center max-w-xl mx-auto shadow-lg px-8 py-6">
            <form onSubmit={handleSubmit} className="w-full">
              <p className="text-center text-2xl font-bold pb-6"> Edit Post </p>
              <div className="relative w-39 h-39 mx-auto mb-5 group">
                <img
                  className="w-39 h-39 rounded-full border border-gray-300 object-cover"
                  src={post?.photo}
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span
                    className="text-white font-semibold"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  >
                    Edit
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <p className="pb-1"> Title </p>
              <input
                value={post?.title}
                onChange={(e) =>
                  setPost((prev) =>
                    prev
                      ? { ...prev, title: e.target.value }
                      : { ...({} as Post), title: e.target.value }
                  )
                }
                placeholder="Title"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> About </p>
              <textarea
                value={post?.about}
                onChange={(e) =>
                  setPost((prev) =>
                    prev
                      ? { ...prev, about: e.target.value }
                      : { ...({} as Post), about: e.target.value }
                  )
                }
                placeholder="About post"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <textarea
                value={post?.post}
                onChange={(e) =>
                  setPost((prev) =>
                    prev
                      ? { ...prev, post: e.target.value }
                      : { ...({} as Post), post: e.target.value }
                  )
                }
                placeholder="Post"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <button
                type="submit"
                className="w-full bg-blue-300 font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 hover:bg-blue-500 transition"
              >
                {" "}
                Save{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;
