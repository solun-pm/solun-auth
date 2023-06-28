import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "./loader";
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname()

  const navigate = async (path: any) => {
    await router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  const goToOverview = () => {
    navigate("/dashboard");
  };

  const goToSettings = () => {
    navigate("/dashboard/settings");
  };

  const goToAliases = () => {
    navigate("/dashboard/aliases");
  };

  const goToDomains = () => {
    navigate("/dashboard/domains");
  };

  return (
      <>
      {loading && <Loader />}
        <nav className="flex flex-col md:flex-row md:justify-between items-center md:space-x-4 space-y-2 md:space-y-0 bg-slate-950 p-4 mb-4 rounded-lg shadow-xl">
          <div className="flex flex-col md:flex-row justify-start md:space-x-4 space-y-2 md:space-y-0 w-full">
            <button
              onClick={goToOverview}
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                pathname === "/dashboard" ? "bg-blue-500" : "hover:bg-blue-500"
              }`}
            >
              Overview
            </button>
            <button
              onClick={goToSettings}
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                pathname === "/dashboard/settings"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Settings
            </button>
            <button
              onClick={goToAliases}
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                pathname === "/dashboard/aliases"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Aliases
            </button>
            {/*
            <button
              onClick={goToDomains}
              className={`text-white font-bold py-2 px-4 rounded transition-all w-full md:w-auto text-center ${
                pathname === "/dashboard/domains"
                  ? "bg-blue-500"
                  : "hover:bg-blue-500"
              }`}
            >
              Domains
            </button>
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