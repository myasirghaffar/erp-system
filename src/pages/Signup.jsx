import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSignupMutation } from "../services/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

import loginBg from "../assets/images/login-form.png";
import logo from "../assets/images/grayLogo.svg";
import floatingIcon from "../assets/icons/loginformbg.svg";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const data = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      joinAs: "customer"
    };

    try {
      const result = await signup({ data });
      if (result.data) {
        setIsSubmitted(true);
        toast.success("Account created successfully!");
        navigate("/login");
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

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* First Name Field */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-sm font-medium font-urbanist">First Name</label>
              <input
                type="text"
                placeholder="Samra"
                className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <span className="text-[10px] text-red-500">{errors.firstName.message}</span>}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-sm font-medium font-urbanist">Last Name</label>
              <input
                type="text"
                placeholder="Yousuf"
                className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <span className="text-[10px] text-red-500">{errors.lastName.message}</span>}
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-sm font-medium font-urbanist">Phone Number</label>
              <input
                type="text"
                placeholder="+67543"
                className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                {...register("phoneNumber", { required: "Phone number is required" })}
              />
              {errors.phoneNumber && <span className="text-[10px] text-red-500">{errors.phoneNumber.message}</span>}
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

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-black text-sm font-medium font-urbanist">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-10 px-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
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
              <div className="flex justify-start">
                <Link to="#" className="text-stone-500 text-xs font-normal font-urbanist hover:text-indigo-600 transition-colors">
                  Forgot Password?
                </Link>
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
        </div>
      </div>

      <ToastContainer theme="colored" />
    </div>
  );
};

export default SignUp;
