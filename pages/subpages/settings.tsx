"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import TwoFactorAuthSetup from "@/components/settings/twoFactorAuthSetup";
import ChangePassword from "@/components/settings/changePassword";
import PrivacySettings from "@/components/settings/privacySettings";

const SettingsPage = ({userInfo, userDetails}: any) => {
  const router = useRouter();

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-5 align-start">
        <ChangePassword userInfo={userInfo} />
        <TwoFactorAuthSetup userDetails={userDetails} userInfo={userInfo} />
        </div>
        <div className="flex flex-col">
        <PrivacySettings userDetails={userDetails} userInfo={userInfo} />
        </div>
    </div>
    </>
  );
};

export default SettingsPage;