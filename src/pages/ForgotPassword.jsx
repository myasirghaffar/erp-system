import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForgetPasswordMutation } from "../services/Api";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import logo from "../assets/images/grayLogo.svg";
import floatingIcon from "../assets/icons/loginformbg.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await forgotPassword({ data: { email: data.email } });
      
      if (result.data) {
        setIsEmailSent(true);
        toast.success(
          "If an account with that email exists, a password reset link has been sent to your email."
        );
      } else if (result.error) {
        const errorMessage =
          result.error.data?.message ||
          result.error.data?.error ||
          "Failed to send reset email. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-400 from 13% to-cyan-600 bg-center bg-no-repeat p-4 relative overflow-hidden">
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
          <h1 className="text-3xl font-bold text-black font-urbanist tracking-tight text-center">
            Forgot Password
          </h1>

          {!isEmailSent ? (
            <>
              <p className="text-stone-600 text-sm font-urbanist text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-black text-base font-medium font-urbanist">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="email"
                      placeholder="username@gmail.com"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-2 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                {/* Back to Login */}
                <Link
                  to="/login"
                  className="w-full h-11 mt-2 border border-stone-200 hover:border-indigo-500 text-stone-700 hover:text-indigo-600 text-base font-medium font-urbanist rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-black font-urbanist">
                  Check Your Email
                </h2>
                <p className="text-stone-600 text-sm font-urbanist">
                  If an account with that email exists, a password reset link has been sent to your email.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-stone-500 text-xs font-urbanist mt-2">
                  The link will expire in 1 hour.
                </p>
              </div>

              {/* Back to Login */}
              <Link
                to="/login"
                className="w-full h-12 mt-4 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              {/* Resend Link Option */}
              <button
                onClick={() => setIsEmailSent(false)}
                className="text-stone-500 text-sm font-urbanist hover:text-indigo-600 transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          {/* Footer Links */}
          <div className="text-center mt-2">
            <span className="text-black text-sm font-normal font-urbanist">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="text-sky-500 text-sm font-semibold font-urbanist hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer theme="colored" />
    </div>
  );
};

export default ForgotPassword;
