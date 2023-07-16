import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHdd, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

function ChangeMailboxQuota({ userInfo, userDetails, mailboxDetails, domain_id, mailbox_id }: any) {
  const router = useRouter();
  const [quotaChangeLoading, setQuotaChangeLoading] = useState(false);
  const [currentQuota, setCurrentQuota] = useState(mailboxDetails.quota);  // Local state for quota
  
  const handleQuotaChange = async (event: any) => {
    event.preventDefault();

    setQuotaChangeLoading(true);

    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/change_quota", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain_id: domain_id,
        mailbox_id: mailbox_id,
        quota: event.target.quota.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      setQuotaChangeLoading(false);
      return;
    }

    setCurrentQuota(event.target.quota.value);
    toast.success(data.message);
    setQuotaChangeLoading(false);
    return;
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Change Mailbox Quota</h2>
      <p className="text-gray-300 mb-4">
        Change the quota of the mailbox. The quota is the maximum amount of disk space the mailbox can use.
        Please note that the quota cannot be changed to a value lower than the current mailbox size.
      </p>
      <form autoComplete="off" onSubmit={handleQuotaChange}>
        <div>
          <div className="mb-4 mt-4">
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faHdd} className="mr-3 text-gray-400" />
              <select 
                name="quota"
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value={512} selected={currentQuota === 512} disabled={currentQuota === 1024}>512MB</option>
                <option value={1024} selected={currentQuota === 1024}>1024MB</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={quotaChangeLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {quotaChangeLoading && (
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

export default ChangeMailboxQuota;