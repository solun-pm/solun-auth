"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MailboxSettingsPageProps } from "@/types/subpages";
import { useFetchUserInfo } from "@/hooks/fetchUserInfo";

const MailboxSettingsPage = ({domain_id, mailbox_id}: MailboxSettingsPageProps) => {
  const router = useRouter();
  const { userInfo, userDetails } = useFetchUserInfo() as any;

  if (!userInfo || !userDetails) {
    return null;
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <h1 className="text-2xl font-bold">{mailbox_id}</h1>
        <h1 className="text-2xl font-bold">{domain_id}</h1>
    </div>
    </>
  );
};

export default MailboxSettingsPage;