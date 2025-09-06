"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.fullName.length < 2) newErrors.fullName = "Full name must be at least 2 characters";
    if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const errorMessage = await response.text();
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "An error occurred during signup" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col">
        <div className="flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border px-10 py-3">
            <div className="flex items-center gap-4 text-foreground">
              <div className="size-6 text-green-600">
                {/* <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" />
                </svg> */}
              </div>
              <h2 className="text-xl font-bold">AgroAI</h2>
            </div>

            <div className="flex items-center gap-4">

              <Link href="api/auth/signin">
                <button className="h-10 px-4 rounded-full bg-secondary text-secondary-foreground text-sm font-bold hover:scale-105 hover:bg-secondary/80 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                  Sign In
                </button>
              </Link>

              <button className="h-10 px-4 rounded-full bg-green-600 text-white text-sm font-bold hover:scale-105 hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                Sign Up
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-bold">
                  Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Join AgriView to start monitoring your crops with AI-powered insights.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`flex h-12 w-full rounded-lg border border-solid border-gray-300 px-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-destructive text-xs">{errors.fullName}</p>}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`flex h-12 w-full rounded-lg border border-solid border-gray-300 px-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.username && <p className="text-destructive text-xs">{errors.username}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`flex h-12 w-full rounded-lg border border-solid border-gray-300 px-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`flex h-12 w-full rounded-lg border border-solid border-gray-300 px-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                        errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`flex h-12 w-full rounded-lg border border-solid border-gray-300 px-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600 transition-all ${
                       errors.confirmPassword ? "border-destructive" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-xs">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                    <p className="text-destructive text-sm font-medium">{errors.general}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center items-center rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white shadow transition-all hover:bg-green-700 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-green-600 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-sm"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
