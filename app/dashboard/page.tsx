"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const DashboardPage = () => {
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

  const memberSince = new Date(userDetails.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        {/* <h1 className="text-2xl font-bold mb-2">Dashboard</h1> */}
        <Navigation />
        {/* @ts-ignore */}
        <h1 className="text-2xl font-bold">Welcome back, {userInfo.username}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
            <h2 className="text-xl font-bold mb-2">Your account</h2>
            <p className="text-gray-400">E-Mail: {userInfo.fqe}</p>
            {/* Display additional user details here */}
            <p className="text-gray-400">Membership: {userDetails.membership.slice(0, 1).toUpperCase() + userDetails.membership.slice(1)}</p>
            <p className="text-gray-400">Member since: {memberSince}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 rounded-lg shadow-md max-w-lg mt-4">
              <h2 className="text text-xl font-bold mb-2">
                  Solun <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300">Mail Pro</span>
              </h2>
              <div className="flex flex-wrap justify-between">
                  <div className="flex items-center mb-2 w-full md:w-1/2">
                      <FontAwesomeIcon icon={faCheck} className="text-white mr-2"/>
                      <p className="text-white">50GB storage space</p>
                  </div>
                  <div className="flex items-center mb-2 w-full md:w-1/2">
                      <FontAwesomeIcon icon={faCheck} className="text-white mr-2"/>
                      <p className="text-white">Send up to 10.000 messages per day</p>
                  </div>
              </div>
              <button className="mt-4 bg-white text-blue-700 font-bold py-2 px-4 rounded hover:bg-blue-200 transition-colors duration-150">Learn More</button>
          </div>
        </div>
        <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-2">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Webmail</h2>
              <p className="text-gray-400">Send and receive encrypted mails</p>
              <a href={"https://"+process.env.NEXT_PUBLIC_WEBMAIL_DOMAIN} className="text-blue-500 hover:text-blue-400">Go to Webmail</a>
            </div>
            <div className="bg-slate-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Encrypt Message</h2>
              <p className="text-gray-400">Encrypt a message for someone else</p>
              <a href={"https://"+process.env.NEXT_PUBLIC_MAIN_DOMAIN+"/msg/"} className="text-blue-500 hover:text-blue-400">Go to Encrypt Message</a>
            </div>
            <div className="bg-slate-900 p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">Upload File</h2>
              <p className="text-gray-400">Upload a file to be encrypted</p>
              <a href={"https://"+process.env.NEXT_PUBLIC_MAIN_DOMAIN+"/file/"} className="text-blue-500 hover:text-blue-400">Go to Upload File</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;