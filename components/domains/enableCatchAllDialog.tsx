import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCircleNotch, faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { isValidEmail } from 'solun-general-package';

const EnableCatchAllDialog = ({ isOpen, closeModal, userInfo, userDetails, domain_id, updateCatchAll }: any) => {
const cancelButtonRef = useRef(null);
const [step, setStep] = useState(1);
const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
const [forwardingAddresses, setForwardingAddresses] = useState([] as any);
const [inputEmail, setInputEmail] = useState("");
const [emailValid, setEmailValid] = useState(true);

const enableCatchAll = async () => {
  setSubmitButtonLoading(true);

  if(forwardingAddresses.length === 0) {
    toast.error('Please enter at least one forwarding address to enable catch-all');
    setSubmitButtonLoading(false);
    return;
  }

  for (let i = 0; i < forwardingAddresses.length; i++) {
    if (!isValidEmail(forwardingAddresses[i])) {
      toast.error('Please enter a valid email address');
      setSubmitButtonLoading(false);
      return;
    }
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/domain/enable_catch_all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userInfo.user_id,
      domain_id: domain_id,
      forwarding_addresses: forwardingAddresses,
      token: localStorage.getItem("jwt"),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.message);
    setSubmitButtonLoading(false);
    return;
  }

  setSubmitButtonLoading(false);
  setStep(2);
  
  updateCatchAll(true);
};  

const closeDialog = () => {
  closeModal();
  setSubmitButtonLoading(false);
  setForwardingAddresses([]);
  setStep(1);
};

const handleAddEmail = () => {
  if(inputEmail === "") {
    toast.error('Please enter an email address');
    return;
  }
  if(forwardingAddresses.includes(inputEmail)) {
    toast.error('This email address is already added');
    return;
  }
  if (forwardingAddresses.length >= 25) {
    toast.error('You can only add up to 25 forwarding addresses');
    return;
  }
  if(isValidEmail(inputEmail)) {
    setForwardingAddresses([...forwardingAddresses, inputEmail]);
    setInputEmail("");
    setEmailValid(true);
  } else {
    toast.error('Please enter a valid email address');
    setEmailValid(false);
  }
};

const handleRemoveEmail = (email: string) => {
  setForwardingAddresses(forwardingAddresses.filter((e: string) => e !== email));
};

const handleChangeEmail = (e: any) => {
  setInputEmail(e.target.value);
  setEmailValid(isValidEmail(e.target.value));
}

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
                <h1 className="text-white text-2xl">Enable Catch-All</h1>
                <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                    Where should we forward all the emails?
                </p>
                <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faGlobe} className="mr-3 text-gray-400" />
                    <input
                        type="text"
                        className="bg-slate-950 text-slate-300 rounded p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                        placeholder="Enter forwarding email"
                        value={inputEmail}
                        onChange={handleChangeEmail}
                    />
                    <button 
                        onClick={handleAddEmail} 
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                    {forwardingAddresses.map((email: string, index: number) => (
                        <div key={index} className="text-white bg-blue-500 px-3 py-1 rounded">
                            <p>{email}
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-white ml-2 cursor-pointer"
                                onClick={() => handleRemoveEmail(email)}
                            />
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                    onClick={closeDialog}
                    disabled={submitButtonLoading}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => enableCatchAll()}
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
                <div className="flex flex-col items-center justify-center space-y-6">
                    <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-green-500 text-6xl"
                    />
                    <h1 className="text-white text-2xl text-center">Catch-All enabled</h1>
                    <p className="text-slate-300 text-md mt-2 mb-4 text-center break-words">
                        All emails sent to your domain will be forwarded to the email addresses you specified.
                    </p>
                    <button 
                        onClick={() => closeDialog()} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
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

export default EnableCatchAllDialog;