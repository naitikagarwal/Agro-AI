'use client';
import React, { useEffect, useState } from 'react';

export default function SignInPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference on page load
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.body.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900">
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f5f0] dark:border-b-zinc-800 px-10 py-3">
            <div className="flex items-center gap-4 text-[#181811] dark:text-white">
              <div className="size-6 text-primary">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                </svg>
              </div>
              <h2 className="text-[#181811] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">AgriView</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-[#181811] dark:text-white focus:outline-none" onClick={handleThemeToggle}>
                <svg className={`h-6 w-6 ${!isDarkMode ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <svg className={`h-6 w-6 ${isDarkMode ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-secondary text-sm font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105">
                <span className="truncate">Sign In</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f5f5f0] dark:bg-zinc-800 text-[#181811] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105">
                <span className="truncate">Sign Up</span>
              </button>
            </div>
          </header>
          <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[#181811] dark:text-white">Welcome back</h2>
                <p className="mt-2 text-center text-sm text-[#8c8b5f] dark:text-zinc-400">
                  Sign in to monitor your crops.
                </p>
              </div>
              <form action="#" className="mt-8 space-y-6" method="POST">
                <input name="remember" type="hidden" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label className="sr-only" htmlFor="email-address">Email address</label>
                    <input autoComplete="email" className="form-input appearance-none relative block w-full px-3 py-4 border-none bg-[#f5f5f0] dark:bg-zinc-800 placeholder-[#8c8b5f] dark:placeholder-zinc-400 text-[#181811] dark:text-white rounded-t-xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" id="email-address" name="email" placeholder="Email address" required type="email" />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="password">Password</label>
                    <input autoComplete="current-password" className="form-input appearance-none relative block w-full px-3 py-4 border-none bg-[#f5f5f0] dark:bg-zinc-800 placeholder-[#8c8b5f] dark:placeholder-zinc-400 text-[#181811] dark:text-white rounded-b-xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" id="password" name="password" placeholder="Password" required type="password" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a className="font-medium text-primary hover:text-yellow-400" href="#"> Forgot your password? </a>
                  </div>
                </div>
                <div>
                  <button className="group relative flex w-full justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-secondary bg-primary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-105" type="submit">
                    Sign in
                  </button>
                </div>
              </form>
              <p className="mt-2 text-center text-sm text-[#8c8b5f] dark:text-zinc-400">
                Don't have an account?
                <a className="font-medium text-primary hover:text-yellow-400" href="#"> Sign up </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}