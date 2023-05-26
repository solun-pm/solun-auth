"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('jwt');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/info', {
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
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        {/* @ts-ignore */}
        <p className="mb-5">Welcome back! {userInfo.username}</p>
        <button 
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-3 rounded transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;