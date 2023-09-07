import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function ApiAccess({ userDetails, userApiDetails }: any) {
  const [token, setToken] = useState("");
  const [apiAccess, setApiAccess] = useState(false);
  const [apiAccessLoading, setApiAccessLoading] = useState(false);

  useEffect(() => {
    if (userDetails.api_access) {
      setApiAccess(true);
      setToken(userApiDetails.token);
    } else {
      setApiAccess(false);
    }
  }, [userDetails, userApiDetails]);

  const toggleApiAccess = async () => {
    setApiAccessLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/api_access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userDetails.user_id,
        api_access: !apiAccess,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      setApiAccessLoading(false);
      return;
    }

    setApiAccessLoading(false);
    setApiAccess(!apiAccess);
    setToken(data.token);
    toast.success(data.message);
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">API Settings</h2>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">API Access</h3>
        <p className="text-md mb-4 text-slate-300">
            Enable this to get access to the Solun API, with this you can fetch mails,
            create accounts and more.
        </p>
        <div className="flex justify-between gap-4">
          {!apiAccess ? (
            <button
              type="button"
              onClick={toggleApiAccess}
              disabled={apiAccessLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {apiAccessLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Enable
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleApiAccess}
              disabled={apiAccessLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {apiAccessLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Disable
            </button>
          )}
        </div>
      </div>

    {apiAccess && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">API Token</h3>
            <p className="text-md mb-4 text-slate-300">
                Copy your unique token, and follow our documentation to get started.
            </p>
            <div className="flex justify-between gap-4">
                <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-md text-slate-300 blur-md">{token}</p>
                </div>
                <CopyToClipboard text={token}>
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                    >
                        Copy
                    </button>
                </CopyToClipboard>
            </div>
      </div>
    )}
    </div>
  );
}

export default ApiAccess;
