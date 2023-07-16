import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMailBulk, faBolt, faTrash, faArrowLeft, faCocktail } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import AddMailboxDialog from "../mailbox/addMailboxDialog";
import toast from 'react-hot-toast';
import AreYouSureBro from '@/components/misc/areYouSureBro';
import EnableCatchAllDialog from "./enableCatchAllDialog";

const  DomainSettingsTopBar = ({ domain_id, userInfo, userDetails, mailboxCount, rateLimit, refreshMailboxes, domain, catch_all }: any) => {
  const router = useRouter();
  const [isAddMailboxDialogOpen, setIsAddMailboxDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCatchAllDialogOpen, setIsCatchAllDialogOpen] = useState(false);

  const confirmDelete = async (confirmed: boolean) => {
    if (confirmed) {
      setIsDialogOpen(false);
  
      const promise = fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/delete_domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          domain_id: domain_id,
        }),
      })
      .then(async (res) => {
        const data = await res.json();
    
        if (!res.ok) {
          throw new Error(data.message);
        }
        return data.message;
      });
  
      toast.promise(
        promise,
        {
          loading: 'Deleting domain...',
          success: (data) => 'The domain and all its mailboxes and aliases have been deleted',
          error: (err) => 'Something went wrong'
        }
      );

      // redirect to domains page after 2 seconds
      setTimeout(() => {
        router.push('/dash/domains');
      }, 2000);
    } else {
      setIsDialogOpen(false);
    }
  };

  const disableCatchAll = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/disable_catch_all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain_id: domain_id,
      }),
    });

    if (!res.ok) {
      toast.error('Something went wrong');
      return;
    }

    toast.success('Catch-all has been disabled');
    setIsCatchAllDialogOpen(false);
  };

  return (
    <>
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
          {!catch_all && (
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded flex hover:bg-blue-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
            onClick={() => setIsCatchAllDialogOpen(true)}
          >
            <FontAwesomeIcon icon={faCocktail} className="mr-2"/> Enable Catch-All
          </button>
          )} : {(
            <button 
            className="bg-red-500 text-white px-4 py-2 rounded flex hover:bg-red-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
            onClick={() => disableCatchAll()}
          >
            <FontAwesomeIcon icon={faCocktail} className="mr-2"/> Disable Catch-All
          </button>
          )}
        </div>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded flex hover:bg-red-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
          onClick={() => setIsDialogOpen(true)}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2"/> Delete Domain
        </button>
        <AddMailboxDialog userInfo={userInfo} isOpen={isAddMailboxDialogOpen} closeModal={() => setIsAddMailboxDialogOpen(false)} domain={domain} refreshMailboxes={refreshMailboxes} />
        <EnableCatchAllDialog userInfo={userInfo} isOpen={isCatchAllDialogOpen} closeModal={() => setIsCatchAllDialogOpen(false)} domain_id={domain_id} />
      </div>
      <AreYouSureBro 
      isOpen={isDialogOpen} 
      closeModal={() => setIsDialogOpen(false)} 
      buttonAction={confirmDelete}
      task="domain"
    />
    </>
  );   
};

export default DomainSettingsTopBar;