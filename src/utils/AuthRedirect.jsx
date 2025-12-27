import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth?.isAuthenticated);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return null;
};

export default AuthRedirect;
