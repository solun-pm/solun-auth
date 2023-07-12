import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMailBulk, faBolt, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const  DomainSettingsTopBar = ({ userInfo, userDetails, mailboxCount, rateLimit }: any) => {

  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex items-center space-x-4">
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded flex hover:bg-gray-600 transition-all items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/> Go back
        </button>
        <div className="flex">
          <div className="px-4 py-2 bg-blue-500 text-white rounded">
            <FontAwesomeIcon icon={faMailBulk} className="mr-1" />
            {mailboxCount === 1 ? <span><span className="font-semibold">1</span> Mailbox</span> : <span><span className="font-semibold">{mailboxCount}</span> Mailboxes</span>}
          </div>
          <div className="px-4 py-2 bg-blue-500 text-white rounded ml-4">
            <FontAwesomeIcon icon={faBolt} className="mr-1" />
            <span><span className="font-semibold">{rateLimit}</span> Rate Limit</span>
          </div>
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded flex hover:bg-blue-600 transition-all items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add Mailbox
        </button>
      </div>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded flex hover:bg-red-600 transition-all items-center"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-2"/> Delete
      </button>
    </div>
  );   
};

export default DomainSettingsTopBar;