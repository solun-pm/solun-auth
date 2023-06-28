"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faDatabase,
  faBolt,
  faUser,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { generateTempToken } from "solun-general-package";
import Link from "next/link";

const DashboardPage = ({userInfo, userDetails}: any) => {
  const router = useRouter();
  const [showTooltipMailPro, setShowTooltipMailPro] = useState(false);
  const [showTooltipWebmail, setShowTooltipWebmail] = useState(false);

  const memberSince = new Date(userDetails.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );


  const webmailDirectLogin = async () => {
    const url = await generateTempToken(
      userDetails.user_id,
      userDetails.fqe,
      "Mail",
      localStorage.getItem("jwt"),
      userInfo.password,
      userDetails.fast_login
    );

    if (typeof url === "string") {
      toast.success("Redirecting to Webmail...");
      router.push(url);
    }
  };

  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-ignore */}
          <h1 className="text-2xl font-bold">
            Welcome back, {userInfo.username}!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
              <h2 className="text-xl font-bold mb-2">Your account</h2>
              <p className="text-gray-400">E-Mail: {userInfo.fqe}</p>
              {/* Display additional user details here */}
              <p className="text-gray-400">
                Membership:{" "}
                {userDetails.membership.slice(0, 1).toUpperCase() +
                  userDetails.membership.slice(1)}
              </p>
              <p className="text-gray-400">Member since: {memberSince}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 rounded-lg shadow-md max-w-lg mt-4">
              <h2 className="text text-xl font-bold mb-2">
                Solun{" "}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300">
                  Mail Pro
                </span>
              </h2>
              <div className="flex flex-wrap justify-between">
                <div className="flex items-center mb-2 w-full md:w-1/2">
                  <FontAwesomeIcon
                    icon={faDatabase}
                    className="text-white mr-2"
                  />
                  <p className="text-white">50GB storage space</p>
                </div>
                <div className="flex items-center mb-2 w-full md:w-1/2">
                  <FontAwesomeIcon icon={faBolt} className="text-white mr-2" />
                  <p className="text-white">No Limits</p>
                </div>
                <div className="flex items-center mb-2 w-full md:w-1/2">
                  <FontAwesomeIcon icon={faUser} className="text-white mr-2" />
                  <p className="text-white">Custom aliases</p>
                </div>
                <div className="flex items-center mb-2 w-full md:w-1/2">
                  <FontAwesomeIcon
                    icon={faUserSecret}
                    className="text-white mr-2"
                  />
                  <p className="text-white">Hide my E-Mail</p>
                </div>
              </div>
              <div className="relative">
                {showTooltipMailPro && (
                  <div className="absolute w-64 left-1/2 transform md:-translate-x-72 -translate-x-52 -translate-y-20 bg-black text-white p-2 text-md rounded-md shadow-lg mt-2">
                    This feature is currently in development. Mail Pro will be
                    available in the near future.
                  </div>
                )}
                <button
                  className="mt-4 bg-white text-blue-700 font-bold py-2 px-4 rounded hover:bg-blue-200 transition-colors duration-150"
                  onMouseEnter={() => setShowTooltipMailPro(true)}
                  onMouseLeave={() => setShowTooltipMailPro(false)}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mb-2">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-900 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">
                  Webmail
                </h2>
                <p className="text-gray-400">
                  This feature is currently in development. You can already use your Mail in software like Thunderbird or Outlook.
                </p>
                <div className="flex items-center justify-center flex-col gap-2">
                <button
                  /*onClick={webmailDirectLogin}*/
                  className="text-blue-500 hover:text-slate-300 cursor-pointer"
                  onMouseEnter={() => setShowTooltipWebmail(true)}
                  onMouseLeave={() => setShowTooltipWebmail(false)}
                >
                  Go to Webmail 
                </button>
                {/*
                <Link href="https://solun.pm/features">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Production Beta</span>
                </Link>
                */}
                </div>
              </div>
              <div className="bg-slate-900 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Encrypt Message</h2>
                <p className="text-gray-400">Send an encrypted message to your colleagues and share private information</p>
                <a
                  href={process.env.NEXT_PUBLIC_MAIN_DOMAIN + "/msg/"}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Go to Encrypt Message
                </a>
              </div>
              <div className="bg-slate-900 p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Upload File</h2>
                <p className="text-gray-400">Upload a file to Solun and let us encrypt it for you and send it to your colleagues</p>
                <a
                  href={process.env.NEXT_PUBLIC_MAIN_DOMAIN + "/file/"}
                  className="text-blue-500 hover:text-blue-400"
                >
                  Go to Upload File
                </a>
              </div>
            </div>
          </div>
        </Suspense>
      </>
  );
};

export default DashboardPage;