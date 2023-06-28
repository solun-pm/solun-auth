"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

import OverviewPage from "@/pages/subpages/overview";
import SettingsPage from "@/pages/subpages/settings";
import AliasesPage from "@/pages/subpages/aliases";

import { Toaster } from "react-hot-toast";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const MainPage = ({params}: {params: { path: string }}) => {
  const router = useRouter();
  const [Subpage, setSubpage] = useState(null);

  const { userInfo, userDetails } = useFetchUserInfo() as any;

  useEffect(() => {
    switch (params.path) {
      case 'overview':
        setSubpage(<OverviewPage userInfo={userInfo} userDetails={userDetails} /> as any);
        break;
      case 'settings':
        setSubpage(<SettingsPage userInfo={userInfo} userDetails={userDetails} /> as any);
        break;
      case 'aliases':
        setSubpage(<AliasesPage userInfo={userInfo} userDetails={userDetails} /> as any);
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
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        {Subpage}
      </div>
    </div>
  );
};

export default MainPage;