import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Account/Register";
import Home, { type Post } from "./pages/Menu/Home";
import Login from "./pages/Account/Login";
import NotFound from "./pages/NotFoundPage";
import ProtectedRoute, { authorizedContext } from "./components/ProtectedRoute";
import { ACCESS_TOKEN } from "./services/constants";
import { createContext, useEffect, useState } from "react";
import api from "./services/api";
import PostPage from "./pages/Posts/PostPage";
import AddPost from "./pages/Posts/AddPost";
import MyProfile from "./pages/Profiles/MyProfile";
import Profiles from "./pages/Profiles/Profiles";
import UserProfile from "./pages/Profiles/UserProfile";
import EditProfile from "./pages/Profiles/EditProfile";
import EditPost, { DeletePost } from "./pages/Posts/EditPost";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  bio: string;
  country: string;
  is_staff: string;
  date_joined: string;
  social_link: string;
  posts: Post[];
}

type PostContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export const postContext = createContext<PostContextType>({
  posts: [],
  setPosts: () => {},
});

type UserContextType = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const userContext = createContext<UserContextType>({
  users: [],
  setUsers: () => {},
});

export const AuthContext = createContext<any>(null);

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      setIsAuthorized(true);
    }
    api
      .get("/api/posts/")
      .then((res) => {
        setPosts(res.data);
        console.log(res.data);
      })
      .catch((err) => alert(err.message));
    api
      .get("/api/profiles/")
      .then((res) => setUsers(res.data))
      .catch((err) => alert(err.message));
    api
      .get("/api/profiles/my/")
      .then((res) => setCurrentUser(res.data))
      .catch(() => setCurrentUser(null));
  }, [location.state]);
  //console.log(posts, "jvhduybcduij");

  return (
    <authorizedContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        <postContext.Provider value={{ posts: posts || [], setPosts }}>
          <userContext.Provider value={{ users: users || [], setUsers }}>
            <Routes key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<RegisterandLogout />} />
              <Route path="/post/:pk" element={<PostPage />} />
              <Route path="/addPost/" element={<AddPost />} />
              <Route path="/post/:pk/edit" element={<EditPost />} />
              <Route path="/post/:pk/delete" element={<DeletePost />} />
              <Route
                path="/my"
                element={
                  <ProtectedRoute>
                    {" "}
                    <MyProfile />{" "}
                  </ProtectedRoute>
                }
              />
              <Route path="/users" element={<Profiles />} />
              <Route path="/users/:username" element={<UserProfile />} />
              <Route path="/my/edit" element={<EditProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </userContext.Provider>
        </postContext.Provider>
      </AuthContext.Provider>
    </authorizedContext.Provider>
  );
}

export default App;
