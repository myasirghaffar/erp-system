import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../store/slices/authSlice";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const userRole = user?.role;

  // Allowed roles for dashboard access
  const allowedRoles = ['admin', 'manager'];

  useEffect(() => {
    if (isLoggedIn && user) {
      // Check if user has an allowed role
      if (userRole && allowedRoles.includes(userRole)) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        // User is authenticated but doesn't have required role (e.g., employee)
        // Clear user session and redirect to login
        dispatch(clearUser());
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, user, userRole, navigate, dispatch]);

  return null;
};

export default AuthRedirect;
