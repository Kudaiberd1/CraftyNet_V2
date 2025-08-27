import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../services/constants";
import { authorizedContext } from "./ProtectedRoute";

export const url = "http://localhost:5173";

interface Props {
  route: string;
  method: string;
}

const Form = ({ route, method }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthorized } = useContext(authorizedContext);

  const name = method == "login" ? "Login" : "Register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, email, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setIsAuthorized(true);
        navigate("/", { state: { refresh: true } });
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.status == 400) {
        alert("This accaount already exist!");
      } else if (error.status == 401) {
        alert("No active account found with the given credentials");
      } else {
        alert("Somthing gone wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col flex items-center">
      <div className="box shadow sm:translate-mt-15 mt-20 w-full max-w-lg rounded-xl box shadow rounded-lg ">
        <form
          onSubmit={handleSubmit}
          className="flex-1 p-8 max-w-md mx-auto space-y-6"
        >
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {name} {name == "Login" && "to your account "}
          </h1>
          <p className="text-left block mb-2 text-sm font-medium ">
            Your username
          </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full flex px-4 py-2 border border-gray-500 rounded bg-gray-100"
          />
          {name == "Register" && (
            <>
              <p className="text-left block mb-2 text-sm font-medium ">
                E-mail
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full flex px-4 py-2 border border-gray-500 rounded bg-gray-100"
              />
            </>
          )}
          <p className="text-left block mb-2 text-sm font-medium ">
            Your password
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full flex px-4 py-2 border border-gray-500 rounded bg-gray-100 mb-8"
          />
          <button
            type="submit"
            className="w-full text-white bg-emerald-500 font-semibold hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
          >
            {name}
          </button>
          {name == "Login" ? (
            <p className="text-sm">
              Don’t have an account yet?{" "}
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </p>
          ) : (
            <p className="text-sm">
              Do you have account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;
