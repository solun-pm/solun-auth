import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEnvelope, faRandom, faCheckCircle, faClock, faTimesCircle, faHdd, faMailReplyAll } from '@fortawesome/free-solid-svg-icons';
import { formatBytes } from 'solun-general-package';

const MailboxCard = ({ id, fqe, quota_used, quota, mails, active, created} : any) => {
  const router = useRouter();

  const redirectToMailbox = () => {
    router.push(`/dash/mailbox/${id}`);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 shadow-md flex flex-col justify-between h-full relative">
      <div className="flex items-center absolute top-1/2 transform -translate-y-1/2">
        <div className="border-l-2 border-blue-500 shadow-lg h-36"></div>
      </div>
      <div className="pl-8">
        <h2 className="font-bold text-2xl mb-1">{fqe}</h2>
        <div className="text-slate-300 mb-1">
          <p>
              <FontAwesomeIcon icon={faHdd} className="h-4 w-4 inline-block mr-1" />
              Quota: {formatBytes(quota_used)} / {formatBytes(quota)} ({quota > 0 ? ((quota_used/quota)*100).toFixed(2) : 0}%)
          </p>
          <p><FontAwesomeIcon icon={faMailReplyAll} className="h-4 w-4 inline-block mr-1" />Mails: {mails}</p>
          {/*@ts-ignore*/}
          <p><FontAwesomeIcon icon={active ? faCheckCircle : faTimesCircle} className={`h-4 w-4 inline-block mr-1 ${active ? 'text-green-500' : 'text-red-500'}`} />Status: {active ? 'Active' : 'Inactive'}</p>
          <div className="text-slate-300 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-1"/>
            <p>Created: {new Date(created).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="h-10 text-white py-2 px-4 rounded font-bold bg-blue-500 hover:bg-blue-600 transition-all" onClick={redirectToMailbox}>
          Edit
        </button>
      </div>
    </div>
  );  
};

export default MailboxCard;