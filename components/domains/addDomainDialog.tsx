import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCircleNotch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import DnsRecord from './dnsRecordDialog';

const AddDomainDialog = ({ isOpen, closeModal, userInfo, userDetails }: any) => {
  const cancelButtonRef = useRef(null);
  const [dnsData, setDnsData] = useState([]);
  const [step, setStep] = useState(1);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [domain, setDomain] = useState("");

  const checkDomain = async () => {
    if (domain === '') {
      toast.error('Please enter a domain');
      setSubmitButtonLoading(false);
      return;
    }
    setSubmitButtonLoading(true);
    
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/check_domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: domain,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.valid === false) {
      setSubmitButtonLoading(false);
      toast.error(data.message);
      return;
    }

    if (data.valid === true) {
      setSubmitButtonLoading(false);
      addDomain();
    }
  };
  
  const addDomain = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/add_domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain: domain,
      }),
    });

    const data = await res.json();

    setSubmitButtonLoading(false);
    setStep(2);

    setDnsData(data.dnsData);
  };

  const closeDialog = () => {
    closeModal();
    setDnsData([]);
    setStep(1);
    setDomain("");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={isOpen}
        onClose={closeDialog}
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
            {step === 1 && (
              <div className="my-4">
                <h1 className="text-white text-2xl">Add a new Domain</h1>
                <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                  Please enter a domain to proceed.
                  This domain will be added to your account and you can start creating mailboxes and aliases for it.
                  In the next step you will see the DNS records you need to add to your domain.
                </p>
                <label className="text-slate-300 text-md">Domain</label>
                <div className="mb-4 flex items-center mt-1">
                  <FontAwesomeIcon icon={faGlobe} className="mr-3 text-gray-400" />
                  <input
                    type="text"
                    className="bg-slate-950 text-slate-300 p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                    placeholder="Enter your domain"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                    onClick={closeDialog}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => checkDomain()}
                    type="submit"
                    disabled={submitButtonLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  >
                    {submitButtonLoading && (
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="animate-spin mr-2"
                      />
                    )}
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="my-4">
                <h1 className="text-white text-2xl">DNS Data</h1>
                <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                  Please add the following DNS records to your domain.
                  If you don't know how to do this, please contact your domain provider or check out our <a href="https://docs.solun.pm/" target="_blank" className="text-blue-500">documentation</a>.
                  After that click on the Complete button.
                </p>
                {dnsData && dnsData.map((entry: any, index: any) => (
                    <DnsRecord key={index} entry={entry} />
                ))}
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                    onClick={closeDialog}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    type="submit"
                    disabled={submitButtonLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  >
                    {submitButtonLoading && (
                      <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="animate-spin mr-2"
                      />
                    )}
                    Complete
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
                <div className="flex flex-col items-center justify-center space-y-6">
                    <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-green-500 text-6xl"
                    />
                    <h1 className="text-white text-2xl text-center">Domain successfully added</h1>
                    <p className="text-slate-300 text-md mt-2 mb-4 text-center break-words">
                        Your domain is currently being verified, you will see its status in your Domain Dashboard.
                        If it's active you can start creating mailboxes and aliases for it.
                        <br/>
                        We will send you an email once your domain is active.
                    </p>
                    <button 
                        onClick={() => closeDialog()} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200" // Blauer Button
                    >
                        Finish
                    </button>
                </div>
            )}
          </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );  
};

export default AddDomainDialog;