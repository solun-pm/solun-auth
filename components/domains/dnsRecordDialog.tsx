import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DnsRecord = ({ entry }: any) => {
  const [copyIcon, setCopyIcon] = useState(true);

  const handleClick = () => {
    setCopyIcon(false);
    setTimeout(() => setCopyIcon(true), 3000);
  };

  return (
    <div className="mb-4 p-3 bg-slate-800 rounded-lg">
      <div className="flex items-center">
        <span className="rounded-full bg-gray-500 px-3 py-1 text-white text-xs font-bold mr-3">{entry.type}</span>
        <h3 className="text-slate-300 break-all">{entry.name}</h3>
      </div>
      <div className="mt-2 bg-slate-900 p-2 rounded">
        <div className="flex items-center justify-between">
          <p className="text-white">{entry.data}</p>
          <CopyToClipboard text={entry.data}>
            <button onClick={handleClick}>
              <FontAwesomeIcon icon={copyIcon ? faCopy : faCheck} className={copyIcon ? "text-slate-300" : "text-green-500"} />
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

export default DnsRecord;