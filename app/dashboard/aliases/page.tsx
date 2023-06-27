"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";

import AliasCard from "@/components/aliases/aliasCard";
import AliasesTopBar from "@/components/aliases/aliasTopBar";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const AliasesPage = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4*2;
  const { userInfo, userDetails } = useFetchUserInfo() as any;

  if (!userInfo || !userDetails) {
    return null;
  }

  const aliases = [] as any;

  const aliasesToShow = aliases.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <h1 className="text-2xl font-bold">Manage Aliases</h1>
        {aliases.length === 0 ? (
          <div className="text-slate-300 text-center mt-16 mb-8 text-md">
            You don't have any aliases yet. They're handy, why not add some?
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {aliasesToShow.map((alias: any, index: any) => (
                <AliasCard key={index} aliasName={alias.aliasName} domain={alias.domain} />
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setCurrentPage((oldPage) => Math.max(oldPage - 1, 1))} 
                className={`mx-2 px-4 py-2 text-white rounded transition-all ${currentPage === 1 ? 'bg-slate-900 hover:bg-slate-950' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="mx-2 px-4 py-2 text-white">
                {currentPage} / {Math.ceil(aliases.length / itemsPerPage)}
              </div>
              <button 
                onClick={() => setCurrentPage((oldPage) => Math.min(oldPage + 1, Math.ceil(aliases.length / itemsPerPage)))} 
                className={`mx-2 px-4 py-2 text-white rounded transition-all ${currentPage === Math.ceil(aliases.length / itemsPerPage) ? 'bg-slate-900 hover:bg-slate-950' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={currentPage === Math.ceil(aliases.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AliasesPage;