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
  const itemsPerPage = 4;
  const [domains, setDomains] = useState([]) as any;
  const { userInfo, userDetails } = useFetchUserInfo() as any;

 const getDomains = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/get_domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        token: localStorage.getItem("jwt"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Failed to fetch domains');
      return;
    }

    setDomains(data);
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      getDomains();
    }
  }, [getDomains, userInfo]);
  

  if (!userInfo || !userDetails) {
    return null;
  }

  const domainsToShow = Array.isArray(domains) 
  ? domains.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage)
  : [];
  
  return (
    <>
        <h1 className="text-2xl font-bold">Manage Domains</h1>
        <DomainMenuTopBar userInfo={userInfo} userDetails={userDetails} domainCount={domains.length} refreshDomains={getDomains} />
        {domains.length === 0 ? (
            <div className="text-slate-300 text-center mt-16 mb-8 text-md">
            You don't have any domains yet, buy or add some!
            </div>
        ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
            {domainsToShow.map((domain: any, index: any) => (
              <DomainCard key={index} id={domain.domain_id} domain={domain.domain} status={domain.status} mailboxes={domain.mailbox_count} aliases={domain.alias_count} mailbox_cap={domain.mailbox_cap} alias_cap={domain.alias_cap} created_at={domain.created_at} />
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