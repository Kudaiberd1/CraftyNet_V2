import { useContext, type FormEvent, useRef, useState } from "react";
import { AuthContext } from "../../App";
import SideBar from "../Menu/NavBar";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import default_image from "../../assets/default.png";
import { COUNTRIES } from "../../services/constants";

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setCurrentUser({ ...currentUser, avatar: previewUrl });
      // Optionally, you may want to store the file for uploading later.
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (currentUser) {
      formData.append("first_name", currentUser.first_name || "");
      formData.append("last_name", currentUser.last_name || "");
      formData.append("bio", currentUser.bio || "");
      formData.append("email", currentUser.email || "");
      formData.append("social_link", currentUser.social_link || "");
      formData.append("country", currentUser.country || "");
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
    }
    api
      .patch("/api/profiles/my/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate("/my");
      })
      .catch((err) => alert(err));
  };

  return (
    <>
      <SideBar />
      <div className="py-4 px-2 sm:ml-64">
        <div className="py-4 px-2 mt-14">
          <div className="items-center max-w-xl mx-auto shadow-lg px-8 py-6">
            <form onSubmit={handleSubmit} className="w-full">
              <p className="text-center text-2xl font-bold pb-6">
                {" "}
                Edit Profile{" "}
              </p>
              <div className="relative w-39 h-39 mx-auto mb-5 group">
                <img
                  className="w-39 h-39 rounded-full border border-gray-300 object-cover"
                  src={currentUser?.avatar ? currentUser.avatar : default_image}
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
              <p className="pb-1"> First Name </p>
              <input
                value={currentUser?.first_name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, first_name: e.target.value })
                }
                placeholder="First Name"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> Last Name </p>
              <input
                value={currentUser?.last_name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, last_name: e.target.value })
                }
                placeholder="Last Name"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> Bio </p>
              <textarea
                value={currentUser?.bio}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, bio: e.target.value })
                }
                placeholder="bio"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> E-mail </p>
              <input
                value={currentUser?.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                placeholder="E-mail"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> Social Link </p>
              <input
                value={currentUser?.social_link}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    social_link: e.target.value,
                  })
                }
                placeholder="Social Link"
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              />
              <p className="pb-1"> Country </p>
              <select
                value={currentUser?.country || "null"}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, country: e.target.value })
                }
                className="w-full flex px-4 py-2 border border-gray-200 rounded mb-5"
              >
                <option value="null" disabled>
                  Select a country
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
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

export default EditProfile;
