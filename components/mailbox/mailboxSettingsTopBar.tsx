import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AreYouSureBro from '@/components/misc/areYouSureBro';

const  MailboxSettingsTopBar = ({ userInfo, domain_id, mailbox_id, rateLimit }: any) => {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirmDelete = async (confirmed: boolean) => {
    if (confirmed) {
      setIsDialogOpen(false);
  
      const promise = fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/delete_mailbox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          domain_id: domain_id,
          mailbox_id: mailbox_id,
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
          loading: 'Deleting mailbox...',
          success: (data) => 'Mailbox deleted',
          error: (err) => 'Something went wrong'
        }
      );
    } else {
      setIsDialogOpen(false);
    }
  };  

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between my-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 justify-center sm:justify-start w-full sm:w-auto">
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded flex hover:bg-gray-600 transition-all items-center w-full sm:w-auto mb-4 sm:mb-0"
            onClick={() => router.push('/dash/domain/' + domain_id)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2"/> Go back
          </button>
          <div className="flex">
            <div className="px-4 py-2 bg-blue-500 text-white rounded ml-4">
              <FontAwesomeIcon icon={faBolt} className="mr-1" />
              <span><span className="font-semibold">{rateLimit}</span> Rate Limit</span>
            </div>
          </div>
        </div>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded flex hover:bg-red-600 transition-all items-center w-full sm:w-auto mt-4 sm:mt-0"
          onClick={() => setIsDialogOpen(true)}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2"/> Delete Mailbox
        </button>
      </div>
      <AreYouSureBro 
      isOpen={isDialogOpen} 
      closeModal={() => setIsDialogOpen(false)} 
      buttonAction={confirmDelete}
    />
  </>
  );   
};

export default MailboxSettingsTopBar;