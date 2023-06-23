import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  };

  const goToOverview = () => {
    router.push("/dashboard");
  };

  const goToSettings = () => {
    router.push("/dashboard/settings");
  };

  return (
    <>
      <nav className="flex justify-start bg-slate-950 p-4 mb-4 rounded-lg shadow-xl">
        <button
          onClick={goToOverview}
          className={`mr-4 text-white font-bold py-2 px-4 rounded transition-all ${
            pathname === "/dashboard" ? "bg-blue-500" : "hover:bg-blue-500"
          }`}
        >
          Overview
        </button>
        <button
          onClick={goToSettings}
          className={`text-white font-bold py-2 px-4 rounded transition-all ${
            pathname === "/dashboard/settings"
              ? "bg-blue-500"
              : "hover:bg-blue-500"
          }`}
        >
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="ml-auto text-white font-bold py-2 px-4 rounded transition-all hover:bg-blue-500"
        >
          Logout
        </button>
      </nav>
    </>
  );
};

export default Navigation;
