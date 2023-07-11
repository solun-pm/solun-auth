"use client";

import { Suspense, lazy, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";

const OverviewPage = lazy(() => import("@/pages/subpages/overview"));
const SettingsPage = lazy(() => import("@/pages/subpages/settings"));
const AliasesPage = lazy(() => import("@/pages/subpages/aliases"));
const DomainsPage = lazy(() => import("@/pages/subpages/domains"));
const DomainSettingsPage = lazy(() => import("@/pages/subpages/domain_settings"));

import { Toaster } from "react-hot-toast";

import Loader from "@/components/loader";

const PageContent = ({ path }: any) => {
  switch (path[0]) {
    case "overview":
      return <OverviewPage />;
    case "settings":
      return <SettingsPage />;
    case "aliases":
      return <AliasesPage />;
    case "domains":
      return <DomainsPage />;
    case "domain":
      return <DomainSettingsPage id={path[1]} />;
    default:
      return <Loader />;
  }
};

const MainPage = ({ params }: { params: { path: string } }) => {
  const router = useRouter();

  useEffect(() => {
    if (!["overview", "settings", "aliases", "domains", "domain"].includes(params.path[0])) {
      router.push("/");
    }
  }, [params.path, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl min-h-[790px]">
        <Navigation />
        <Suspense fallback={<Loader />}>
          <PageContent path={params.path} />
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;