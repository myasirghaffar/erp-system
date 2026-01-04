import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useVerifyResetTokenQuery,
  useResetPasswordMutation,
} from "../services/Api";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react";

import logo from "../assets/images/grayLogo.svg";
import floatingIcon from "../assets/icons/loginformbg.svg";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  const {
    data: tokenData,
    isLoading: isVerifyingToken,
    error: tokenError,
  } = useVerifyResetTokenQuery(token, {
    skip: !token,
  });

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  // Password validation regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing. Please request a new password reset link.");
      setTimeout(() => navigate("/forgot-password"), 2000);
    } else if (tokenError) {
      const errorMessage =
        tokenError.data?.message ||
        tokenError.data?.error ||
        "Invalid or expired reset token. Please request a new password reset link.";
      toast.error(errorMessage);
      setTimeout(() => navigate("/forgot-password"), 3000);
    }
  }, [token, tokenError, navigate]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const result = await resetPassword({
        data: {
          token: token,
          newPassword: data.newPassword,
        },
      });

      if (result.data) {
        setIsSuccess(true);
        toast.success("Password reset successfully! You can now login with your new password.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (result.error) {
        const errorMessage =
          result.error.data?.message ||
          result.error.data?.error ||
          "Failed to reset password. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Show loading state while verifying token
  if (isVerifyingToken) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-400 from 13% to-cyan-600 bg-center bg-no-repeat p-4 relative overflow-hidden">
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-stone-600 font-urbanist">Verifying reset token...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if token is invalid
  if (tokenError || !token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-400 from 13% to-cyan-600 bg-center bg-no-repeat p-4 relative overflow-hidden">
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
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-black font-urbanist">
              Invalid or Expired Token
            </h2>
            <p className="text-stone-600 text-sm font-urbanist">
              This password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <Link
              to="/forgot-password"
              className="w-full h-12 mt-4 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/login"
              className="text-stone-500 text-sm font-urbanist hover:text-indigo-600 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            Reset Password
          </h1>

          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-black font-urbanist">
                Password Reset Successful!
              </h2>
              <p className="text-stone-600 text-sm font-urbanist">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <p className="text-stone-500 text-xs font-urbanist mt-2">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <>
              <p className="text-stone-600 text-sm font-urbanist text-center">
                Please enter your new password below.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* New Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-black text-base font-medium font-urbanist">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full h-11 pl-10 pr-12 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                        pattern: {
                          value: passwordRegex,
                          message:
                            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <span className="text-[10px] text-red-500">
                      {errors.newPassword.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-black text-base font-medium font-urbanist">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full h-11 pl-10 pr-12 rounded-xl border border-stone-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-stone-300 text-black text-sm font-urbanist"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[10px] text-red-500">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                  {confirmPassword &&
                    newPassword &&
                    confirmPassword !== newPassword && (
                      <span className="text-[10px] text-red-500">
                        Passwords do not match
                      </span>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-stone-50 rounded-lg p-3 text-xs text-stone-600 font-urbanist">
                  <p className="font-semibold mb-1">Password Requirements:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>At least 8 characters long</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isResetting ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                  className="w-full h-12 mt-2 bg-gradient-to-b from-sky-400 to-cyan-600 hover:from-sky-500 hover:to-cyan-700 text-white text-lg font-semibold font-urbanist rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-70"
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;

