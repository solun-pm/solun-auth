import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

function ChangePassword({ userInfo } : any) {
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

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

    return (
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
    )
}

export default ChangePassword;