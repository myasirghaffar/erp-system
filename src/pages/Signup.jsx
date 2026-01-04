import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSignupMutation } from "../services/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

import logo from "../assets/images/grayLogo.svg";
import floatingIcon from "../assets/icons/loginformbg.svg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth } = useSelector((state) => state);
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      phone_number: "",
      email: "",
      password: "",
    },
  });

  // Password validation regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const onSubmit = async (values) => {
    const data = {
      username: values.username,
      email: values.email,
      password: values.password,
      phone_number: values.phone_number,
    };

    try {
      const result = await signup({ data });
      if (result.data) {
        setIsSubmitted(true);
        const message = result.data?.message || "Admin will approve your request";
        toast.success(message);
        // Don't navigate immediately - show approval message
      } else if (result.error) {
        const errorMessage = result.error.data?.message || result.error.data?.error || "Signup failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred during signup.");
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

      <div className="w-full max-w-[460px] px-6 py-6 md:px-10 md:py-8 bg-white rounded-[32px] shadow-2xl backdrop-blur-md flex flex-col items-center gap-4 border border-indigo-500/20 relative z-10">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="CleanTrust Logo" className="w-20 h-auto" />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-black font-urbanist tracking-tight text-center lg:text-left">Sign Up</h1>

          {isSubmitted ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-black font-urbanist">
                  Account Created Successfully!
                </h2>
                <p className="text-stone-600 text-sm font-urbanist">
                  Admin will approve your request. You will be notified once your account is approved.
                </p>
              </div>

              {/* Back to Login */}
              <Link
                to="/login"
                className="w-full h-11 mt-4 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              {/* Username Field */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-sm font-medium font-urbanist">Username</label>
                <input
                  type="text"
                  placeholder="hamzassa"
                  className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: {
                      value: 2,
                      message: "Username must be at least 2 characters"
                    }
                  })}
                />
                {errors.username && <span className="text-[10px] text-red-500">{errors.username.message}</span>}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-sm font-medium font-urbanist">Email</label>
                <input
                  type="email"
                  placeholder="username@gmail.com"
                  className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-sm font-medium font-urbanist">Phone Number</label>
                <input
                  type="text"
                  placeholder="+9333386433"
                  className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("phone_number", { 
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Phone number must be a valid international format (e.g., +1234567890)"
                    }
                  })}
                />
                {errors.phone_number && <span className="text-[10px] text-red-500">{errors.phone_number.message}</span>}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1">
                <label className="text-black text-sm font-medium font-urbanist">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="SecurePass1234s!"
                    className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long"
                      },
                      pattern: {
                        value: passwordRegex,
                        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
                      }
                    })}
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
                
                {/* Password Requirements */}
                <div className="bg-stone-50 rounded-lg p-2 text-xs text-stone-600 font-urbanist mt-1">
                  <p className="font-semibold mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>At least 8 characters long</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isSigningUp || auth.loading}
                className="w-full h-11 mt-2 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70"
              >
                {isSigningUp || auth.loading ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Footer Links */}
              <div className="text-center mt-2">
                <span className="text-black text-sm font-normal font-urbanist">Already have an account ? </span>
                <Link to="/login" className="text-sky-500 text-sm font-semibold font-urbanist hover:underline">
                  Log In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <ToastContainer theme="colored" />
    </div>
  );
};

export default SignUp;
