"use client";

import React, { Suspense, lazy } from "react";
import { useRouter } from "next/router";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import { useFetchUserInfo } from "@/hooks/fetchUserInfo";
import Loader from "@/components/loader";

const OverviewPage = lazy(() => import("@/pages/subpages/overview"));
const SettingsPage = lazy(() => import("@/pages/subpages/settings"));
const AliasesPage = lazy(() => import("@/pages/subpages/aliases"));

const MainPage = () => {
  const router = useRouter();
  const { userInfo, userDetails } = useFetchUserInfo() as any;
  
  const { path } = router.query;
  
  let Subpage;
  switch (path) {
    case 'overview':
      Subpage = OverviewPage;
      break;
    case 'settings':
      Subpage = SettingsPage;
      break;
    case 'aliases':
      Subpage = AliasesPage;
      break;
    default:
      router.push('/');
  }

  if (!userInfo || !userDetails) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <Suspense fallback={<Loader />}>
          {Subpage && <Subpage />}
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;