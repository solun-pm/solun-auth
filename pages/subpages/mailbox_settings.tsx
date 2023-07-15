"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { MailboxSettingsPageProps } from "@/types/subpages";
import { useFetchUserInfo } from "@/hooks/fetchUserInfo";
import MailboxSettingsTopBar from "@/components/mailbox/mailboxSettingsTopBar";
import ChangeMailboxPassword from "@/components/mailbox/changeMailboxPassword";
import ChangeMailboxQuota from "@/components/mailbox/changeMailboxQuota";

const MailboxSettingsPage = ({domain_id, mailbox_id}: MailboxSettingsPageProps) => {
  const router = useRouter();
  const { userInfo, userDetails } = useFetchUserInfo() as any;
  const [mailbox, setMailbox] = useState([]) as any;

  const getMailboxDetails = useCallback(async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/get_mailbox_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain_id: domain_id,
        mailbox_id: mailbox_id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Failed to fetch mailbox details');
      router.push("/dash/domains");
      return;
    }
    setMailbox(data);
  }, [userInfo, domain_id, mailbox_id]);

  useEffect(() => {
    if (userInfo) {
      getMailboxDetails();
    }
  }, [getMailboxDetails, userInfo]);

  if (!userInfo || !userDetails) {
    return null;
  }

  const rateLimit = mailbox.rate_limit + mailbox.rate_limit_interval;

  
  return (
    <>
        <h1 className="text-2xl font-bold">{mailbox.fqe} Settings</h1>
        <MailboxSettingsTopBar domain_id={domain_id} rateLimit={rateLimit} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="grid grid-cols-1 gap-5 align-start">
            <ChangeMailboxPassword userInfo={userInfo} domain_id={domain_id} mailbox_id={mailbox_id} />
          </div>
          <div className="flex flex-col">
            <ChangeMailboxQuota userInfo={userInfo} userDetails={userDetails} mailboxDetails={mailbox} domain_id={domain_id} mailbox_id={mailbox_id} />
          </div>
        </div>
    </>
  );
}

export default MailboxSettingsPage;