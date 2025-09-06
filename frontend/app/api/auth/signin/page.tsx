"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during signin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col">
        <div className="flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border px-10 py-3">
            <div className="flex items-center gap-4 text-foreground">
              <div className="size-6 text-green-600">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">AgriView</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Sign Up button */}
              <Link href="/signup">
                <button className="h-10 px-4 rounded-full bg-secondary text-secondary-foreground text-sm font-bold hover:scale-105 hover:bg-secondary/80 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                  Sign Up
                </button>
              </Link>

              {/* Active Sign In button */}
              <button className="h-10 px-4 rounded-full bg-green-600 text-white text-sm font-bold hover:scale-105 hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                Sign In
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-bold">
                  Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Enter your credentials to access your account.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Username */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-foreground"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="flex h-12 w-full rounded-lg border px-10 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 transition-all border-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="flex h-12 w-full rounded-lg border px-10 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 transition-all border-input"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                    <p className="text-destructive text-sm font-medium">
                      {error}
                    </p>
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
                      Signing In...
                    </div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-green-600 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-sm"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
