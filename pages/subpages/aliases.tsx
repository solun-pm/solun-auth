"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import toast, { Toaster } from "react-hot-toast";

import AliasCard from "@/components/aliases/aliasCard";
import AliasesTopBar from "@/components/aliases/aliasTopBar";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const AliasesPage = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3*2;
  const [aliases, setAliases] = useState([]) as any;
  const { userInfo, userDetails } = useFetchUserInfo() as any;

  const getAliases = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/alias/get_alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Failed to fetch aliases');
      return;
    }

    setAliases(data);
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      getAliases();
    }
  }, [getAliases, userInfo]);
  

  if (!userInfo || !userDetails) {
    return null;
  }

  const aliasesToShow = aliases.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <>
        <h1 className="text-2xl font-bold">Manage Aliases</h1>
        <AliasesTopBar userInfo={userInfo} aliasCount={aliases.length} refreshAliases={getAliases} />
        {aliases.length === 0 ? (
            <div className="text-slate-300 text-center mt-16 mb-8 text-md">
            You don't have any aliases yet. They're handy, why not add some?
            </div>
        ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {aliasesToShow.map((alias: any, index: any) => (
                <AliasCard key={index} userInfo={userInfo} aliasName={alias.alias_name} domain={alias.domain} isActive={alias.active} goto={alias.goto} refreshAliases={getAliases} />
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
    </>
  );
};

export default AliasesPage;