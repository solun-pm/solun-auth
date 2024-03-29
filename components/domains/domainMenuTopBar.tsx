import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AddDomainDialog from "./addDomainDialog";

const  DomainMenuTopBar = ({ userInfo, userDetails, domainCount, refreshDomains }: any) => {
    const [isAddDomainDialogOpen, setIsAddDomainDialogOpen] = useState(false);

  return (
    <div className="flex items-center my-4">
      <div className="px-4 py-2 bg-blue-500 text-white rounded">
        <FontAwesomeIcon icon={faBoxArchive} className="mr-1" />
        {domainCount === 1 ? <span><span className="font-semibold">1</span> Domain</span> : <span><span className="font-semibold">{domainCount}</span> Domains</span>}
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded flex hover:bg-blue-600 transition-all items-center ml-4"
        onClick={() => setIsAddDomainDialogOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add new
      </button>
      <AddDomainDialog isOpen={isAddDomainDialogOpen} closeModal={() => setIsAddDomainDialogOpen(false)} userInfo={userInfo} userDetails={userDetails} refreshDomains={refreshDomains} />
    </div>
  );
};

export default DomainMenuTopBar;