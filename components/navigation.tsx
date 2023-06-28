import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navigation = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  };

  return (
    <>
      <nav className="flex flex-col md:flex-row md:justify-between items-center md:space-x-4 space-y-2 md:space-y-0 bg-slate-950 p-4 mb-4 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row justify-start md:space-x-4 space-y-2 md:space-y-0 w-full">
          <Link href="/dash/overview"
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                router.pathname === "/dash/overview"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Overview
          </Link>
          <Link href="/dash/settings"
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                router.pathname === "/dash/settings"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Settings
          </Link>
          <Link href="/dash/aliases"
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                router.pathname === "/dash/aliases"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Aliases
          </Link>
          {/*
          <Link href="/dash/domains"
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                router.pathname === "/dash/domains"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Domains
          </Link>
          */}
        </div>
        <button
          onClick={handleLogout}
          className="text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center md:text-left hover:bg-blue-500 mt-4 md:mt-0"
        >
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navigation;