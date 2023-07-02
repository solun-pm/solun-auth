"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import TwoFactorAuthSetup from "@/components/settings/twoFactorAuthSetup";
import ChangePassword from "@/components/settings/changePassword";
import PrivacySettings from "@/components/settings/privacySettings";
import { useFetchUserInfo } from "@/hooks/fetchUserInfo";
import Recovery from "@/components/settings/recovery";

const SettingsPage = () => {
  const router = useRouter();
  const { userInfo, userDetails } = useFetchUserInfo() as any;

  if (!userInfo || !userDetails) {
    return null;
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-5 align-start">
        <ChangePassword userInfo={userInfo} />
        <TwoFactorAuthSetup userDetails={userDetails} userInfo={userInfo} />
        <Recovery userDetails={userDetails} userInfo={userInfo} />
        </div>
        <div className="flex flex-col">
        <PrivacySettings userDetails={userDetails} userInfo={userInfo} />
        </div>
    </div>
    </>
  );
};

export default SettingsPage;