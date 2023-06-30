import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk, faTrash, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState, useEffect } from 'react';

const AliasCard = ({ userInfo, aliasName, domain, refreshAliases }: any) => {

  const [copySuccess, setCopySuccess] = useState(false);

  const handleDeleteAlias = async (aliasName: string, domain: string) => {
    const fqa = aliasName + domain;
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/delete_alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        fqa: fqa,
      }),
    });
    if (!res.ok) {
      toast.error('Something went wrong');
      return;
    }
    toast.success('Alias deleted successfully');
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
    <div className="bg-slate-900 rounded p-4 shadow-md flex flex-col justify-between h-full text-center">
      <div>
        {/*<FontAwesomeIcon icon={faMailBulk} className="h-6 w-6" />*/}
        <div className="text-center break-all">
          <h2 className="font-bold text-xl">{aliasName}</h2>
          <p className="text-gray-400">{domain}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <CopyToClipboard text={aliasName + domain} onCopy={handleCopy}>
          <button
            className={`h-10 py-2 px-4 rounded font-bold transition-all text-center ${copySuccess ? 'text-white bg-green-500 hover:bg-green-600' : 'text-white bg-blue-500 hover:bg-blue-600'}`}
            disabled={copySuccess}
          >
            <FontAwesomeIcon icon={copySuccess ? faCheck : faCopy} className="h-5 inline-block mr-1" /> {copySuccess ? 'Copied' : 'Copy'}
          </button>
        </CopyToClipboard>
        <button
          onClick={() => handleDeleteAlias(aliasName, domain)}
          className="h-10 text-white bg-red-500 py-2 px-4 rounded font-bold hover:bg-red-600 transition-all text-center"
        >
          <FontAwesomeIcon icon={faTrash} className="h-5 inline-block mr-1" /> Delete
        </button>
      </div>
    </div>
  );  
};

export default AliasCard;