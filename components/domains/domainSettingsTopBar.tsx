import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMailBulk, faBolt, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import AddMailboxDialog from "./addMailboxDialog";

const  DomainSettingsTopBar = ({ userInfo, userDetails, mailboxCount, rateLimit, refreshMailboxes, domain }: any) => {
  const router = useRouter();
  const [isAddMailboxDialogOpen, setIsAddMailboxDialogOpen] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between my-4">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 justify-center sm:justify-start w-full sm:w-auto">
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded flex hover:bg-gray-600 transition-all items-center w-full sm:w-auto mb-4 sm:mb-0"
          onClick={() => router.push('/dash/domains')}
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
          className="bg-blue-500 text-white px-4 py-2 rounded flex hover:bg-blue-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
          onClick={() => setIsAddMailboxDialogOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add Mailbox
        </button>
      </div>
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded flex hover:bg-red-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-2"/> Delete
      </button>
      <AddMailboxDialog userInfo={userInfo} isOpen={isAddMailboxDialogOpen} closeModal={() => setIsAddMailboxDialogOpen(false)} domain={domain} refreshDomains={refreshMailboxes} />
    </div>
  );   
};

export default DomainSettingsTopBar;