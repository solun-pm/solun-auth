"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { DomainSettingsPageProps } from "@/types/subpages";

const DomainSettingsPage = ({ id }: DomainSettingsPageProps) => {
  const router = useRouter();
  
  return (
    <>
        <h1 className="text-2xl font-bold">Manage Domain</h1>
        <p className="text-slate-300">id: {id}</p>
    </>
  );
};

export default DomainSettingsPage