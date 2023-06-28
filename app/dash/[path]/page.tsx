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

const MainPage = ({params}: {params: { path: string }}) => {
  const router = useRouter();
  const [Subpage, setSubpage] = useState(null);

  const { userInfo, userDetails } = useFetchUserInfo() as any;

  useEffect(() => {
    switch (params.path) {
      case 'overview':
        setSubpage(<OverviewPage /> as any);
        break;
      case 'settings':
        setSubpage(<SettingsPage /> as any);
        break;
      case 'aliases':
        setSubpage(<AliasesPage /> as any);
        break;
      default:
        router.push('/');
    }
  }, [params.path, router]);

  if (!userInfo || !userDetails) {
    return null;
  }

  if (!Subpage) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
    <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl min-h-[770px]">
      <Navigation />
        <Suspense fallback={<Loader />}>
          {Subpage}
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;