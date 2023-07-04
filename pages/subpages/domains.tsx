"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import DomainMenuTopBar from "@/components/domains/domainMenuTopBar";
import DomainCard from "@/components/domains/domainCard";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const DomainsPage = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4*2;
  const [domains, setDomains] = useState([]) as any;
  //const { userInfo, userDetails } = useFetchUserInfo() as any;

 /* const getDomains = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/get_alias", {
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

    setDomains(data);
  }, [userInfo]);*

  useEffect(() => {
    getAliases();
  }, [getAliases]);
  */

  const initialDomains = [
    { domain: "@test1.tld" },
    { domain: "@test2.tld" },
    { domain: "@test3.tld" },
    { domain: "@test4.tld" },
    { domain: "@test5.tld" },
  ];

  useEffect(() => {
    setDomains(initialDomains);
  }, []);

//  if (!userInfo || !userDetails) {
//    return null;
//  }

  const domainsToShow = domains.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  return (
    <>
        <h1 className="text-2xl font-bold">Manage Domains</h1>
        <DomainMenuTopBar />
        {domains.length === 0 ? (
            <div className="text-slate-300 text-center mt-16 mb-8 text-md">
            You don't have any domains yet, buy or add some!
            </div>
        ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
            {domainsToShow.map((domain: any, index: any) => (
                <DomainCard key={index} domain={domain.domain} />
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
                {currentPage} / {Math.ceil(domains.length / itemsPerPage)}
                </div>
                <button 
                onClick={() => setCurrentPage((oldPage) => Math.min(oldPage + 1, Math.ceil(domains.length / itemsPerPage)))} 
                className={`mx-2 px-4 py-2 text-white rounded transition-all ${currentPage === Math.ceil(domains.length / itemsPerPage) ? 'bg-slate-900 hover:bg-slate-950' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={currentPage === Math.ceil(domains.length / itemsPerPage)}
                >
                Next
                </button>
            </div>
            </>
        )}
    </>
  );
};

export default DomainsPage;