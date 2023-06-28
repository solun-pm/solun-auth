"use client";

import { Suspense, lazy, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

const OverviewPage = lazy(() => import("@/pages/subpages/overview"));
const SettingsPage = lazy(() => import("@/pages/subpages/settings"));
const AliasesPage = lazy(() => import("@/pages/subpages/aliases"));

import { Toaster } from "react-hot-toast";

import Loader from "@/components/loader";

const PageContent = ({ path }: any) => {
  switch (path) {
    case "overview":
      return <OverviewPage />;
    case "settings":
      return <SettingsPage />;
    case "aliases":
      return <AliasesPage />;
    default:
      return <div>Page not found</div>;
  }
};

const MainPage = ({ params }: { params: { path: string } }) => {
  const router = useRouter();

  useEffect(() => {
    if (!["overview", "settings", "aliases"].includes(params.path)) {
      router.push("/");
    }
  }, [params.path, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl min-h-[770px]">
        <Navigation />
        <Suspense fallback={<Loader />}>
          <PageContent path={params.path} />
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;