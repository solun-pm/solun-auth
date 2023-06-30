import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCircleNotch, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

function ChangePassword({ userInfo }: any) {
  const router = useRouter();
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const handleCurrentPasswordVisible = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const handleNewPasswordVisible = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const handleCurrentPasswordChange = (event: any) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordChange = async (event: any) => {
    event.preventDefault();

    setPasswordChangeLoading(true);

    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/change_pwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        currentPassword: currentPassword,
        newPassword: newPassword,
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

    event.target.currentPassword.value = "";
    event.target.newPassword.value = "";
    localStorage.removeItem("jwt");
    router.push("/login");
    return;
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Change Password</h2>
      <p className="text-gray-300 mb-4">
        You can change your password here, you will be logged out after changing
        your password.
      </p>
      <form autoComplete="off" onSubmit={handlePasswordChange}>
        <div>
          <div className="mb-4 mt-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
              <input
                type={currentPasswordVisible ? "text" : "password"}
                name="currentPassword"
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Current Password"
                onChange={handleCurrentPasswordChange}
              />
              {currentPassword.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={currentPasswordVisible ? faEyeSlash : faEye}
                    className="cursor-pointer"
                    onClick={handleCurrentPasswordVisible}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
              <input
                type={newPasswordVisible ? "text" : "password"}
                name="newPassword"
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="New Password"
                onChange={handleNewPasswordChange}
              />
              {newPassword.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={newPasswordVisible ? faEyeSlash : faEye}
                    className="cursor-pointer"
                    onClick={handleNewPasswordVisible}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordChangeLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {passwordChangeLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
