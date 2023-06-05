"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

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

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Change Password</h2>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div>
              <div className="mb-4 mt-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Current Password"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New Password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;