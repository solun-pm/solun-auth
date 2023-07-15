import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk, faTrash, faCopy, faCheck, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState, useEffect } from 'react';

const AliasCard = ({ userInfo, aliasName, domain, isActive, goto, refreshAliases }: any) => {

  const [copySuccess, setCopySuccess] = useState(false);

  const handleSwitchAliasState = async (aliasName: string, domain: string) => {
    const fqa = aliasName + domain;
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/alias/switch_alias_state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        fqa: fqa,
        alias_state: !isActive,
      }),
    });

    if (!res.ok) {
      toast.error('Something went wrong');
      return;
    }

    toast.success(`Alias ${isActive ? 'disabled' : 'enabled'} successfully`);
    refreshAliases();
  }

  const handleCopy = () => {
    setCopySuccess(true);
    toast.success('Alias got copied');
  }

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <div className="bg-white shadow-lg rounded-lg px-8 py-6 mx-4 my-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-blue-500">{aliasName}</h2>
          <p className="text-gray-600">{domain}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={isActive ? faToggleOn : faToggleOff} className="text-gray-500 h-6 cursor-pointer" onClick={() => handleSwitchAliasState(aliasName, domain)} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">{goto}</p>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <CopyToClipboard text={aliasName + domain} onCopy={handleCopy}>
            <button
              className={`transition-colors duration-200 text-white py-2 px-4 rounded font-bold focus:outline-none ${copySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={copySuccess}
            >
              <FontAwesomeIcon icon={copySuccess ? faCheck : faCopy} className="h-5 inline-block mr-2" /> {copySuccess ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
          <button
            onClick={() => handleSwitchAliasState(aliasName, domain)}
            className={`transition-colors duration-200 text-white py-2 px-4 rounded font-bold focus:outline-none ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isActive ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AliasCard;