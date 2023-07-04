import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const DomainCard = ({domain} : any) => {
  return (
    <div className="bg-slate-900 rounded p-4 shadow-md flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <FontAwesomeIcon icon={faGlobe} className="h-6 w-6 mb-2 sm:mb-0 sm:mr-2"/>
        <div className="border-l-2 border-blue-500 pl-2">
          <h2 className="font-bold text-xl text-left">{domain.replace('@', '')}</h2>
          <p className="text-slate-300 text-left">Mailboxes: 0 / 15</p>
          <p className="text-slate-300 text-left">Aliases: 0 / 100</p>
          <p className="text-slate-300 text-left">Status: <span className="text-green-500">Active</span></p>
          {/*<p className="text-slate-300 text-left">Status: <span className="text-orange-500">Pending</span></p>*/}
          {/*<p className="text-slate-300 text-left">Status: <span className="text-red-500">Inactive</span></p>*/}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="h-10 text-white py-2 px-4 rounded font-bold bg-blue-500 hover:bg-blue-600 transition-all">Edit</button>
      </div>
    </div>
  );  
};

export default DomainCard;