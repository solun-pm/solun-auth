"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCircleNotch, faKey } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'qrcode.react';
import { totp } from 'otplib';
import { KeyEncodings } from 'otplib/core';
import { generate2FASecretKey } from '@/utils/generate';
const base32Decode = require('base32-decode')

const SettingsPage = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null) as any;
  const [userDetails, setUserDetails] = useState(null) as any;
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [publicTotpSecret, setPublicTotpSecret] = useState('');
  const [otpAuthUrl, setOtpAuthUrl] = useState('');
  const [enableTwoFA, setEnableTwoFA] = useState(false);
  const [twoFaToken, setTwoFaToken] = useState('');
  const [password, setPassword] = useState('');

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

      if (userDetailsData.two_fa) {
        setEnableTwoFA(true);
      } else {
        setEnableTwoFA(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo || !userDetails) {
    return null;
  }

  const handlePasswordChange = async (event: any) => {
    event.preventDefault();

    setPasswordChangeLoading(true);

    const currentPassword = event.target.currentPassword.value;
    const newPassword = event.target.newPassword.value;

    const res = await fetch('/api/user/changepwd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        currentPassword: currentPassword,
        newPassword: newPassword
      }),
    });

    const data = await res.json();
  
    if (!res.ok) {
      toast.error(data.message);
      setPasswordChangeLoading(false);
      return;
    }

    toast.success(data.message);
    setPasswordChangeLoading(false);

    event.target.currentPassword.value = '';
    event.target.newPassword.value = '';
    return;
  };

  const generateSecret = () => {
    const secret = generate2FASecretKey();
    const hexSecret = Buffer.from(base32Decode(secret, 'RFC4648')).toString('hex');
    setTotpSecret(hexSecret);
    setPublicTotpSecret(secret);

    const issuer = 'Solun'
    const account = userDetails.fqe;
  
    const otpAuth = totp.keyuri(account, issuer, secret);
    setOtpAuthUrl(otpAuth);
  };

  const verifyToken = async () => {
    totp.options = { encoding: KeyEncodings.HEX };

    const isValid = totp.verify({ token: twoFaToken, secret: totpSecret });
  
    if (isValid) {
      setEnableTwoFA(true);
      const res = await fetch('/api/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          secret: publicTotpSecret,
          password: password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
  
      toast.success(data.message);
      return;
    } else {
      toast.error('Invalid token');
      return;
    }
  };

  const disable2FA = async () => {
    const res = await fetch('/api/2fa/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    setTotpSecret('');
    setOtpAuthUrl('');
    setEnableTwoFA(false);
    return;
  };

  const enable2FA = async () => {
    const isPasswordValid = await validate2FAPassword();
  
    if (isPasswordValid) {
      generateSecret();
    }
  };

  const validate2FAPassword = async () => {
    const res = await fetch('/api/user/validatepwd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        password: password,
      }),
    });

    const data = await res.json();
  
    if (!res.ok) {
      toast.error(data.message);
      return false;
    }
  
    return true;
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-screen animate-gradient-x">
      <Toaster
        position="top-right"
      />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-6xl">
        <Navigation />
        <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Change Password</h2>
          <form autoComplete="off" onSubmit={handlePasswordChange}>
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
                  disabled={passwordChangeLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  >
                    {passwordChangeLoading && 
                    <FontAwesomeIcon 
                      icon={faCircleNotch} 
                      className="animate-spin mr-2"
                    />
                    }
                    Submit
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
          <h2 className="text-xl font-bold mb-2">Two-Factor Authentication</h2>
          {!enableTwoFA ? (
            <>
              {!publicTotpSecret ? (
                <>
              <div className="mb-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                    onClick={enable2FA}
                  >
                    Enable
                  </button>
                </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center flex-col items-center">
                    <div className="my-4">
                      <QRCode value={otpAuthUrl} />
                    </div>
                    <div className="my-2 text-center">
                      <p>Or use this secret:</p>
                      <p className="font-mono text-sm">{publicTotpSecret}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                    <input
                      type="text"
                      name="token"
                      className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your token"
                      onChange={(e) => setTwoFaToken(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                      onClick={() => {
                        setTotpSecret('');
                        setOtpAuthUrl('');
                        setPublicTotpSecret('');
                        setPassword('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4"
                      onClick={verifyToken}
                    >
                      Activate
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  onClick={disable2FA}
                >
                  Disable
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;