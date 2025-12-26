import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);

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

    // If authenticated, we allow access to the requested route (assuming all protected routes are admin routes now)
    // You can add a check here if you want to strictly enforce 'admin' role in the user object,
    // but since we removed other roles, basic auth check is the primary gate.
  }, [isAuthenticated, user, navigate, location]);

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    return null;
  }

  // If authenticated and authorized, render children
  return children;
};

export default AuthGuard;
