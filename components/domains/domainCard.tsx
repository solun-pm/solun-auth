import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEnvelope, faRandom, faCheckCircle, faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ViewDNS from './viewDNS';

const DomainCard = ({ id, domain, status, mailboxes, aliases, mailbox_cap, alias_cap, created_at } : any) => {
  const router = useRouter();
  const [viewDnsOpen, setViewDnsOpen] = useState(false);

  let statusIcon;
  switch (status) {
    case 'active':
      statusIcon = faCheckCircle;
      break;
    case 'pending':
      statusIcon = faClock;
      break;
    case 'inactive':
      statusIcon = faTimesCircle;
      break;
  }

  const handleButtonClick = () => {
    if (status === 'pending') {
      setViewDnsOpen(true);
    } else {
      router.push(`/dash/domain/${id}`)
    }
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 shadow-md flex flex-col justify-between h-full relative">
      <div className="flex items-center absolute top-1/2 transform -translate-y-1/2">
        <div className="border-l-2 border-blue-500 shadow-lg h-36"></div>
      </div>
      <div className="pl-8">
        <h2 className="font-bold text-2xl mb-1">{domain.replace('@', '')}</h2>
        <div className="text-slate-300 mb-1">
          <p><FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 inline-block mr-1" />Mailboxes: {mailboxes} / {mailbox_cap}</p>
          <p><FontAwesomeIcon icon={faRandom} className="h-4 w-4 inline-block mr-1" />Aliases: {aliases} / {alias_cap}</p>
          {/*@ts-ignore*/}
          <p><FontAwesomeIcon icon={statusIcon} className={`h-4 w-4 inline-block mr-1 ${status === 'active' ? 'text-green-500' : status === 'pending' ? 'text-orange-500' : 'text-red-500'}`} />Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
          <div className="text-slate-300 flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-1"/>
            <p>Created: {new Date(created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="h-10 text-white py-2 px-4 rounded font-bold bg-blue-500 hover:bg-blue-600 transition-all" onClick={handleButtonClick}>
          {status === 'pending' ? 'View DNS' : 'Edit'}
        </button>
        <ViewDNS isOpen={viewDnsOpen} closeModal={() => setViewDnsOpen(false)} domain={domain} />
      </div>
    </div>
  );  
};

export default DomainCard;