import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCircleNotch, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import RecoveryModal from "@/components/settings/recoveryModal";
import { generateRecoveryCode, hashPassword } from "solun-general-package";

function accountRecovery({ userDetails, userInfo }: any) {
    const [enableRecovery, setEnableRecovery] = useState(false);
    const [recoveryLoading, setRecoveryLoading] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState("");

  useEffect(() => {
    if (userDetails.recoverable) {
        setEnableRecovery(true);
    } else {
        setEnableRecovery(false);
    }
  }, [userDetails]);


  const toggleRecovery = async () => {
    setRecoveryLoading(true);
    let recoveryCodeHash = "";
  
    if (!enableRecovery) {
      const recovery = generateRecoveryCode();
      setRecoveryCode(recovery);
      recoveryCodeHash = await hashPassword(recovery);
    }
  
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/recovery", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          user_id: userInfo.user_id,
          enableRecovery: !enableRecovery,
          recoveryCode: recoveryCodeHash,
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      setRecoveryLoading(false);
      toast.error(data.message);
      return;
    }
  
    setRecoveryLoading(false);
    setEnableRecovery(!enableRecovery);
  
    if (!enableRecovery) {
      setShowRecoveryModal(true);
    } else {
      setShowRecoveryModal(false);
    }
  
    toast.success(data.message);
  }  

  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    setRecoveryCode("");
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Account Recovery</h2>
      <p className="text-gray-300 mb-4">
        Enable account recovery to be able to reset your password in case you
        forget it. You will get an unique recovery passphrase which you should
        write down and keep safe.
      </p>
      {!enableRecovery ? (
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={toggleRecovery}
            disabled={recoveryLoading}
          >
            {recoveryLoading && (
            <FontAwesomeIcon
                icon={faCircleNotch}
                className="animate-spin mr-2"
            />
            )}
            Enable
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={toggleRecovery}
            disabled= {recoveryLoading}
          >
            {recoveryLoading && (
            <FontAwesomeIcon
                icon={faCircleNotch}
                className="animate-spin mr-2"
            />
            )}
            Disable
          </button>
        </div>
      )}
      {showRecoveryModal && (
        <RecoveryModal showRecoveryModal={showRecoveryModal} recoveryCode={recoveryCode} closeRecoveryModal={closeRecoveryModal} />
    )}
    </div>
  );
}

export default accountRecovery;