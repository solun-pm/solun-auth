"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

const OverviewPage = lazy(() => import("@/pages/subpages/overview"));
const SettingsPage = lazy(() => import("@/pages/subpages/settings"));
const AliasesPage = lazy(() => import("@/pages/subpages/aliases"));

import { Toaster } from "react-hot-toast";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";
import Loader from "@/components/loader";

const MainPage = ({ params }: { params: { path: string } }) => {
  const router = useRouter();
  const [subpageKey, setSubpageKey] = useState(0);

  const { userInfo, userDetails } = useFetchUserInfo() as any;

  useEffect(() => {
    switch (params.path) {
      case "overview":
        setSubpageKey((prevKey) => prevKey + 1);
        break;
      case "settings":
        setSubpageKey((prevKey) => prevKey + 1);
        break;
      case "aliases":
        setSubpageKey((prevKey) => prevKey + 1);
        break;
      default:
        router.push("/");
    }
  }, [params.path, router]);

  if (!userInfo || !userDetails) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl min-h-[770px]">
        <Navigation />
        <Suspense key={subpageKey} fallback={<Loader />}>
          {params.path === "overview" && <OverviewPage />}
          {params.path === "settings" && <SettingsPage />}
          {params.path === "aliases" && <AliasesPage />}
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;