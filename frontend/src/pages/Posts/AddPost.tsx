import { useState, type FormEvent } from "react";
import SideBar from "../Menu/NavBar";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  photo: File | null;
  about: string;
  post: string;
  is_published: boolean;
}

const AddPost = () => {
  const [newPost, setNewPost] = useState<Props>({
    title: "",
    photo: null,
    about: "",
    post: "",
    is_published: false,
  });
  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("about", newPost.about);
    formData.append("post", newPost.post);
    formData.append("is_published", newPost.is_published ? "True" : "False");
    if (newPost.photo) {
      formData.append("photo", newPost.photo);
    }

    api
      .post("/api/posts/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Successfully posted");
        navigate("/", { state: { refresh: true } });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <SideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">
          <div className="items-center max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="w-full">
              <h1 className="text-center text-2xl font-bold pb-6">
                {" "}
                Add Post{" "}
              </h1>
              <p className="pb-1"> Title </p>
              <input
                type="text"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <label className="block">
                <span className="sr-only">Choose photo</span>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      photo: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-emerald-50 file:text-emerald-700
                      hover:file:bg-emerald-100 mb-5"
                />
              </label>
              <p className="pb-1"> About </p>
              <textarea
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
                placeholder="About..."
                value={newPost.about}
                onChange={(e) =>
                  setNewPost({ ...newPost, about: e.target.value })
                }
              />
              <p className="pb-1"> Post </p>
              <textarea
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
                placeholder="Content..."
                value={newPost.post}
                onChange={(e) =>
                  setNewPost({ ...newPost, post: e.target.value })
                }
              />
              <select
                value={newPost.is_published ? "1" : "0"}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    is_published: e.target.value === "1",
                  })
                }
                className="pb-4 "
              >
                <option value="0">Draft</option>
                <option value="1">Publish</option>
              </select>
              <button
                type="submit"
                className="w-full bg-green-300 font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 hover:bg-green-500 transition"
              >
                {" "}
                Submit{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPost;
