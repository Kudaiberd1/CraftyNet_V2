import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Home, { type Post } from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFoundPage";
import { authorizedContext } from "./components/ProtectedRoute";
import { ACCESS_TOKEN } from "./services/constants";
import { createContext, useEffect, useState } from "react";
import api from "./services/api";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterandLogout() {
  localStorage.clear();
  return <Register />;
}

type PostContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

export const postContext = createContext<PostContextType>({
  posts: [],
  setPosts: () => {},
});

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

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
  }, []);
  //console.log(posts, "jvhduybcduij");

  return (
    <authorizedContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      <postContext.Provider value={{ posts: posts || [], setPosts }}>
        <Routes key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterandLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </postContext.Provider>
    </authorizedContext.Provider>
  );
}

export default App;
