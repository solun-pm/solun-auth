import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGlobe, faCircleNotch, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AddDomainDialog = ({ isOpen, closeModal, userInfo, userDetails }: any) => {
  const cancelButtonRef = useRef(null);
  const [domain, setDomain] = useState("");
  const [dnsData, setDnsData] = useState([]);
  const [step, setStep] = useState(1);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);

  const checkDomain = async (domain: any) => {
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
      addDomain(domain);
    }
  };
  
  const addDomain = async (domain: any) => {
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

  const updateStatusDomain = async (status: any) => {
    // Your async fetch logic here
  };

  return (
    <Transition show={true} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      initialFocus={cancelButtonRef}
      static
      open={isOpen}
      onClose={closeModal}
    >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* More Dialog code... */}
          {step === 1 && (
            <div className="my-4">
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
                  onClick={checkDomain}
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
              <label className="text-slate-300 text-md">DNS Data</label>
              {dnsData && dnsData.map((entry: any, index: any) => (
                <div key={index} className="mb-4">
                  <p>Type: {entry.type}</p>
                  <p>Name: {entry.name}</p>
                  <p>Data: {entry.data}</p>
                  <CopyToClipboard text={`${entry.type} ${entry.name} ${entry.data}`}>
                    <button>Copy</button>
                  </CopyToClipboard>
                </div>
              ))}
              <div className="mt-4">
                <button
                  onClick={() => updateStatusDomain('pending')}
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
            <div>
              <FontAwesomeIcon icon={faCheckCircle} />
              <p>Domain successfully added</p>
              <p>Your domain is currently being verified, you will see its status in your Domain Dashboard.</p>
              <button onClick={() => {}}>Close</button>
            </div>
          )}
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddDomainDialog;