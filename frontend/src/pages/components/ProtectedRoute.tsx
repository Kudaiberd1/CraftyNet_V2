import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../services/constants";
import { createContext, useEffect, useState } from "react";

export const authorizedContext = createContext<any>(null);

function ProtectedRoute({ children }) {
  const [isAuthorizde, setIsAuthorized] = useState<Boolean | null>(null);
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, [isAuthorizde]);
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status == 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.ACCESS_TOKEN);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decode = jwtDecode(token);
    const tokenExpiration = decode.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken;
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorizde == null) {
    return <div>Loading...</div>;
  } else {
    return isAuthorizde ? children : <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
