import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleNotch, faCheckCircle, faKey, faHdd } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const AddMailboxDialog = ({ userInfo, isOpen, closeModal, domain, refreshMailboxes }: any) => {
  const cancelButtonRef = useRef(null);
  const [step, setStep] = useState(1);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [mailboxName, setMailboxName] = useState("");
  const [password, setPassword] = useState("");
  const [quota, setQuota] = useState("512");
  const [confirmPassword, setConfirmPassword] = useState("");

  const addMailbox = async () => {
    setSubmitButtonLoading(true);

    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/add_mailbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain: domain,
        mailbox_name: mailboxName,
        password: password,
        confirm_password: confirmPassword,
        quota: quota
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
      refreshMailboxes();
      setStep(2);
    }
  };

  const closeDialog = () => {
    closeModal();
    setMailboxName("");
    setPassword("");
    setConfirmPassword("");
    setQuota("512");
    setStep(1);
    refreshMailboxes();
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
                  <h1 className="text-white text-2xl">Add a new Mailbox</h1>
                  <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                    Please enter a name, password and select a quota for the mailbox. 
                    The mailbox will be created under the domain: {domain}.
                  </p>
                  {/* Mailbox Name input */}
                  <label className="text-slate-300 text-md">Mailbox Name</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-gray-400" />
                    <input
                      type="text"
                      className="bg-slate-950 text-slate-300 p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                      placeholder="Enter mailbox name"
                      value={mailboxName}
                      onChange={e => setMailboxName(e.target.value)}
                    />
                  </div>
                  {/* Password input */}
                  <label className="text-slate-300 text-md">Password</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                    <input
                      type="password"
                      className="bg-slate-950 text-slate-300 p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  {/* Confirm Password input */}
                  <label className="text-slate-300 text-md">Confirm Password</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                    <input
                      type="password"
                      className="bg-slate-950 text-slate-300 p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {/* Quota dropdown */}
                  <label className="text-slate-300 text-md">Quota</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faHdd} className="mr-3 text-gray-400" />
                    <select value={quota} onChange={e => setQuota(e.target.value)} className="bg-slate-950 text-slate-300 p-2 pr-7 w-full focus:outline-none focus:border-transparent">
                      <option value="512">512 MB</option>
                      <option value="1024">1024 MB</option>
                    </select>
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
                      onClick={addMailbox}
                      type="submit"
                      disabled={submitButtonLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                    >
                      {submitButtonLoading && (
                        <FontAwesomeIcon icon={faCircleNotch} className="fa-spin mr-2" />
                      )}
                        Add Mailbox
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
                    <h1 className="text-white text-2xl text-center">Mailbox successfully added</h1>
                    <p className="text-slate-300 text-md mt-2 mb-4 text-center break-words">
                        The mailbox {mailboxName}@{domain} has been successfully added to your account.
                    </p>
                    <button 
                        onClick={() => closeDialog()} 
                        ref={cancelButtonRef}
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

export default AddMailboxDialog;