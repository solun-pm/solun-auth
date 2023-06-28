"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

import DashboardPage from "@/pages/overview";
import SettingsPage from "@/pages/settings";
import AliasesPage from "@/pages/aliases";

import { Toaster } from "react-hot-toast";

const MainPage = ({params}: {params: { path: string }}) => {
  const router = useRouter();
  let Subpage;

  switch (params.path) {
    case 'dashboard':
      Subpage = DashboardPage;
      break;
    case 'settings':
      Subpage = SettingsPage;
      break;
    case 'aliases':
      Subpage = AliasesPage;
      break;
    default:
      Subpage = DashboardPage;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
    <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <Subpage />
      </div>
    </div>
  );
};

export default MainPage;