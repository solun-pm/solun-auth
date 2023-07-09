import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import DnsRecord from './dnsRecords';

const ViewDNS = ({ isOpen, closeModal, domain }: any) => {
  const [dnsData, setDnsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/get_dns_records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            domain: domain,
        }),
        }).then((res) => res.json())
        .then((data) => {
            setDnsData(data);
            setLoading(false);
        });
  }, [domain]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={isOpen}
        onClose={closeModal}
      >
        <div className="px-4 min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
                <h1 className="text-white text-2xl">DNS Data</h1>
                <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                  Please add the following DNS records to your domain.
                  If you don't know how to do this, please contact your domain provider or check out our <a href="https://docs.solun.pm/" target="_blank" className="text-blue-500">documentation</a>.
                  <span className="mt-2 font-bold">If you already added the records, please wait up to 24 hours for the changes to take effect.</span>
                  We will notify you via email once the domain is ready to use.
                </p>
              {loading ? (
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon icon={faCog} spin size="3x" className="text-slate-300" />
                </div>
              ) : (
                dnsData && dnsData.map((entry: any, index: any) => (
                  <DnsRecord key={index} entry={entry} />
                ))
              )}
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                  onClick={closeModal}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewDNS;