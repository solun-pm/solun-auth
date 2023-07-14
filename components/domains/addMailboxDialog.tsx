import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleNotch, faCheckCircle, faKey, faHdd, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const AddMailboxDialog = ({ userInfo, isOpen, closeModal, domain, refreshMailboxes }: any) => {

  const [formData, setFormData] = useState({
    username: "",
  });

  const cancelButtonRef = useRef(null);
  const [step, setStep] = useState(1);
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [quota, setQuota] = useState("512");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let timer: any;
    if (formData.username) {
      setStatus("loading");
      timer = setTimeout(async () => {
        await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            domain: '@'+domain, // endpoint expects domain with @
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setExists(data.exists);
            setStatus("resolved");
          })
          .catch((error) => {
            console.error("Error:", error);
            setStatus("rejected");
          });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [formData.username, domain]);

  const handleChange = (e: any) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
    if (name === "username") {
      setStatus("idle");
    }
  };

  const isValidForm = () => {
    const trimmedUsername = formData.username.replace(/\s/g, "");
    const specialCharsRegex = /^[a-zA-Z0-9_.-]+$/;

    return (
      trimmedUsername !== "" &&
      specialCharsRegex.test(trimmedUsername) &&
      domain &&
      password &&
      confirmPassword &&
      status === "resolved" &&
      !exists
    );
  };

  const addMailbox = async () => {
    setSubmitButtonLoading(true);

    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/mailbox/add_mailbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        domain: '@'+domain, // endpoint expects domain with '@
        username: formData.username,
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
      setStep(2);
      refreshMailboxes();
    }
  };

  const closeDialog = () => {
    closeModal();
    setStatus("idle");
    setExists(false);
    setUsername("");
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
                  <label className="text-slate-300 text-md">Mailbox Name</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-gray-400" />
                    <div className="flex w-full rounded overflow-hidden">
                    <div className="relative w-1/2">
                        <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        className="bg-slate-950 text-white p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                        placeholder="Username"
                        />
                        {status === "loading" && (
                        <div className="absolute text-white right-2 top-1/2 transform -translate-y-1/2">
                          <FontAwesomeIcon
                            icon={faCircleNotch}
                            className="animate-spin"
                          />
                        </div>
                      )}
                      {status === "resolved" &&
                        (exists ? (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                          />
                        ))}
                    </div>
                    <select
                        name="domain"
                        className="bg-slate-950 p-2 w-1/2 text-slate-300 focus:outline-none focus:border-transparent appearance-none"
                        value={domain}
                    >
                        <option selected value={domain}>@{domain}</option>
                    </select>
                    </div>
                 </div>
                  <label className="text-slate-300 text-md">Password</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                    <input
                      type="password"
                      className="bg-slate-950 text-slate-300 rounded p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                      placeholder="Enter password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <label className="text-slate-300 text-md">Confirm Password</label>
                  <div className="mb-4 flex items-center mt-1">
                    <FontAwesomeIcon icon={faKey} className="mr-3 text-gray-400" />
                    <input
                      type="password"
                      className="bg-slate-950 text-slate-300 rounded p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <label className="text-slate-300 text-md">Quota</label>
                    <div className="mb-4 items-center mt-1 flex w-full rounded overflow-hidden">
                        <FontAwesomeIcon icon={faHdd} className="mr-3 text-gray-400" />
                        <select
                            className="bg-slate-950 text-white p-2 w-full focus:outline-none focus:border-transparent appearance-none"
                            value={quota}
                            onChange={e => setQuota(e.target.value)}
                        >
                            <option value="512">512 MB</option>
                            <option value="1024">1024 MB</option>
                        </select>
                    </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addMailbox}
                      type="submit"
                      disabled={submitButtonLoading || !isValidForm()}
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
                        The mailbox {username}@{domain} has been successfully added to your account.
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