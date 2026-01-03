import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoginMutation } from "../services/Api";
import { Eye, EyeOff } from "lucide-react";

import loginBg from "../assets/images/login-form.png";
import logo from "../assets/images/grayLogo.svg";
import floatingIcon from "../assets/icons/loginformbg.svg";

const Login = () => {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAutoLogin = async (email, password) => {
    setError(null);
    try {
      const result = await login({ data: { email, password } });
      if (result.data) {
        const token = result.data?.data?.accessToken;
        const user = result.data?.data?.user;
        if (user && token) {
          dispatch(setUser({ ...user, token }));
          toast.success(`Welcome, ${user.name || user.email}!`);
          navigate("/admin/dashboard");
        } else {
          toast.error("Auto login failed. Invalid response from server.");
        }
      } else if (result.error) {
        toast.error(result.error.data?.message || result.error.data?.error || "Auto login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during auto login.");
    }
  };

  const onSubmit = async (data) => {
    setError(null);
    const { email, password } = data;
    try {
      const result = await login({ data: { email, password } });
      if (result.data) {
        const token = result.data?.data?.accessToken;
        const user = result.data?.data?.user;
        if (user && token) {
          dispatch(setUser({ ...user, token }));
          toast.success(`Welcome, ${user.name || user.email}!`);
          navigate("/admin/dashboard");
        } else {
          toast.error("Login failed. Invalid response from server.");
        }
      } else if (result.error) {
        const errorMessage = result.error.data?.message || result.error.data?.error || "Incorrect email or password.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-400 from 13% to-cyan-600 bg-center bg-no-repeat p-4 relative overflow-hidden"
    >
      {/* Floating Background Icons */}
      <img
        src={floatingIcon}
        alt=""
        className="absolute top-5 right-16 w-32 h-32 opacity-40 select-none pointer-events-none"
      />
      <img
        src={floatingIcon}
        alt=""
        className="absolute bottom-5 left-16 w-32 h-32 opacity-40 rotate-180 select-none pointer-events-none"
      />

      <div className="w-full max-w-[460px] px-6 py-8 md:px-10 md:py-10 bg-white rounded-[32px] shadow-2xl backdrop-blur-md flex flex-col items-center gap-6 border border-indigo-500/20 relative z-10">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="CleanTrust Logo" className="w-24 h-auto" />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-black font-urbanist tracking-tight text-center lg:text-left">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-black text-base font-medium font-urbanist">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="username@gmail.com"
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-black text-base font-medium font-urbanist">Password</label>
                <Link to="#" className="text-stone-500 text-xs font-medium font-urbanist hover:text-indigo-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-11 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500">{errors.password.message}</span>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn || auth.loading}
              className="w-full h-12 mt-2 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70"
            >
              {isLoggingIn || auth.loading ? "Logging in..." : "Log in"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-[1px] flex-1 bg-stone-200"></div>
              <span className="text-stone-400 text-xs font-urbanist">Or continue with</span>
              <div className="h-[1px] flex-1 bg-stone-200"></div>
            </div>

            {/* Social Logins */}
            <div className="flex gap-3">
              <button type="button" className="flex-1 h-10 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" alt="Google" />
              </button>
              <button type="button" className="flex-1 h-10 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" className="w-5 h-5" alt="GitHub" />
              </button>
              <button type="button" className="flex-1 h-10 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-5 h-5" alt="Facebook" />
              </button>
            </div>

            {/* Footer Links */}
            <div className="text-center mt-2">
              <span className="text-black text-sm font-normal font-urbanist">Don’t have an account? </span>
              <Link to="/signup" className="text-sky-500 text-sm font-semibold font-urbanist hover:underline">
                Sign Up
              </Link>
            </div>

            {/* Admin Auto-login for testing */}
            <button
              type="button"
              onClick={() => handleAutoLogin("admin@example.com", "admin123")}
              className="mt-2 text-[10px] text-stone-300 hover:text-indigo-500 transition-colors uppercase tracking-widest font-bold"
            >
              Auto Login as Admin
            </button>
          </form>
        </div>
      </div>

      <ToastContainer theme="colored" />
    </div>
  );
};

export default Login;
