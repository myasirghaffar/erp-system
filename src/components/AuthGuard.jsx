import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { clearUser } from "../store/slices/authSlice";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const userRole = user?.role;

  // Allowed roles for dashboard access
  const allowedRoles = ['admin', 'manager'];

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      // Show error toast
      toast.error("Você precisa fazer login para acessar esta página.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to login page
      navigate("/login", {
        replace: true,
        state: { from: location.pathname }, // Save the attempted location
      });
      return;
    }

    // Check if user has an allowed role (admin or manager)
    if (userRole && !allowedRoles.includes(userRole)) {
      // User is authenticated but doesn't have required role (e.g., employee)
      // Clear user session and redirect to login
      dispatch(clearUser());
      toast.error("Acesso negado. Apenas administradores e gerentes podem acessar o painel.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to login page
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }
  }, [isAuthenticated, user, userRole, navigate, location, dispatch]);

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    return null;
  }

  // Check if user has an allowed role before rendering
  if (userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  // If authenticated and authorized (admin or manager), render children
  return children;
};

export default AuthGuard;
