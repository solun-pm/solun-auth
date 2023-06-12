"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation';
import { Toaster } from 'react-hot-toast';
import TwoFactorAuthSetup from '@/components/settings/twoFactorAuthSetup';
import ChangePassword from '@/components/settings/changePassword';

const SettingsPage = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null) as any;
  const [userDetails, setUserDetails] = useState(null) as any;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('jwt');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token
        }),
      });

      if (!response.ok) {
        localStorage.removeItem('jwt');
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUserInfo(data);

      const detailsResponse = await fetch('/api/user/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: data.user_id
        }),
      });

      if (!detailsResponse.ok) {
        localStorage.removeItem('jwt');
        router.push('/login');
        return;
      }
      const userDetailsData = await detailsResponse.json();
      setUserDetails(userDetailsData);
    };

    fetchUserInfo();
  }, []);

  if (!userInfo || !userDetails) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <Toaster
        position="top-right"
      />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <ChangePassword userInfo={userInfo} />
        <TwoFactorAuthSetup userDetails={userDetails} userInfo={userInfo} />
      </div>
    </div>
  );
}

export default SettingsPage;