"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { DomainSettingsPageProps } from "@/types/subpages"; 

import DomainSettingsTopBar from "@/components/domains/domainSettingsTopBar";

import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const DomainSettingsPage = ({ id }: DomainSettingsPageProps) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [mailboxes, setMailboxes] = useState([]) as any;
  const [domain, setDomain] = useState([]) as any;
  const { userInfo, userDetails } = useFetchUserInfo() as any;


  const getDomainDetails = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/get_domain_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain_id: id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Failed to fetch domain details');
      router.push("/dash/domains");
      return;
    }
    setDomain(data);
  }, [userInfo, id]);

 const getMailboxes = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/get_mailbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain_id: id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Failed to fetch mailboxes');
      return;
    }

    setMailboxes(data);
  }, [userInfo, id]);

  useEffect(() => {
    if (userInfo) {
      getDomainDetails();
      getMailboxes();
    }
  }, [getDomainDetails, userInfo, getMailboxes]);
  

  if (!userInfo || !userDetails) {
    return null;
  }

  const mailboxesToShow = Array.isArray(mailboxes) 
  ? mailboxes.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage)
  : [];

  const rateLimit = domain.rate_limit + domain.rate_limit_interval;
  
  return (
    <>
        <h1 className="text-2xl font-bold">{domain.domain} Settings</h1>
        <DomainSettingsTopBar userInfo={userInfo} userDetails={userDetails} mailboxCount={mailboxes.length} rateLimit={rateLimit} refreshMailboxes={getMailboxes} domain={domain.domain} />
        {mailboxes.length === 0 ? (
            <div className="text-slate-300 text-center mt-16 mb-8 text-md">
            You don't have any mailboxes yet, add some!
            </div>
        ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
            {mailboxesToShow.map((domain: any, index: any) => (
              <p>test</p>
              //<DomainCard key={index} id={domain.domain_id} domain={domain.domain} status={domain.status} mailboxes={domain.mailbox_count} aliases={domain.alias_count} mailbox_cap={domain.mailbox_cap} alias_cap={domain.alias_cap} created_at={domain.created_at} />
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
                {currentPage} / {Math.ceil(mailboxes.length / itemsPerPage)}
                </div>
                <button 
                onClick={() => setCurrentPage((oldPage) => Math.min(oldPage + 1, Math.ceil(mailboxes.length / itemsPerPage)))} 
                className={`mx-2 px-4 py-2 text-white rounded transition-all ${currentPage === Math.ceil(mailboxes.length / itemsPerPage) ? 'bg-slate-900 hover:bg-slate-950' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={currentPage === Math.ceil(mailboxes.length / itemsPerPage)}
                >
                Next
                </button>
            </div>
            </>
        )}
    </>
  );
};

export default DomainSettingsPage;