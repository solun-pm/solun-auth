import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGlobe, faCircleNotch, faReply } from "@fortawesome/free-solid-svg-icons";
import { generateAliasName, isValidEmail } from 'solun-general-package';
import toast from "react-hot-toast";

const AddAliasDialog = ({ isOpen, closeModal, userInfo, refreshAliases }: any) => {
  const cancelButtonRef = useRef(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [addAliasLoading, setAddAliasLoading] = useState(false);
  const [domainNames, setDomainNames] = useState([]) as any;
  const [gotos, setGotos] = useState([]) as any;
  const [gotoOption, setGotoOption] = useState("");
  const [customGoto, setCustomGoto] = useState("");

  useEffect(() => {
    async function fetchDomainNames() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/alias/get_domains_alias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
        }),
      });

      const data = await res.json();
      setDomainNames(data);
    }

    async function fetchGotos() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/alias/get_gotos_alias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
        }),
      });

      const data = await res.json();
      setGotos(data);
    }

    fetchDomainNames();
    fetchGotos();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAliasName(generateAliasName());
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setAddAliasLoading(true);
    if (aliasName === "") {
      toast.error("Please enter an alias name");
      setAddAliasLoading(false);
      return;
    }
    if (selectedDomain === "") {
      toast.error("Please select a domain");
      setAddAliasLoading(false);
      return;
    }
    const finalGoto = gotoOption === "custom" ? customGoto : gotoOption;
    if (finalGoto === "") {
      toast.error("Please enter a goto address");
      setAddAliasLoading(false);
      return;
    }
    if (!isValidEmail(finalGoto)) {
      toast.error("Please enter a valid goto address");
      setAddAliasLoading(false);
      return;
    }

    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/alias/add_alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        aliasName: aliasName,
        domain: selectedDomain,
        goto: finalGoto,
      }),
    });

    const data = await res.json();

    if(data.code === 'geringverdiener') {
      setAddAliasLoading(false);
      toast.error(data.message);
      return;
    }

    if (!res.ok) {
      toast.error(data.message);
      setAddAliasLoading(false);
      return;
    }

    toast.success('Alias added successfully');
    closeDialog();
  }

  const closeDialog = () => {
    refreshAliases();
    setAddAliasLoading(false);
    setAliasName("");
    setSelectedDomain("");
    setGotoOption("");
    setCustomGoto("");
    closeModal();
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
            <h1 className="text-white text-2xl">Add a new Alias</h1>
            <p className="text-slate-300 text-md mt-2 mb-4 break-words">
              You can add a new alias here, at the moment you can only add aliases for your solun email.
            </p>
            <div className="my-4">
              <label className="text-slate-300 text-md">Alias Name</label>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
                <input
                  type="text"
                  disabled
                  className="bg-slate-950 text-slate-300 rounded p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                  placeholder="Generated Alias Name"
                  value={aliasName}
                  onChange={e => setAliasName(e.target.value)}
                />
              </div>
            </div>
            <div className="my-4">
              <label className="text-slate-300 text-md">Domain</label>
              <div className="mb-4 flex items-center mt-1">
                <FontAwesomeIcon icon={faGlobe} className="mr-3 text-gray-400" />
                <div className="flex w-full rounded overflow-hidden">
                  <select
                    className="bg-slate-950 text-white p-2 w-full focus:outline-none focus:border-transparent appearance-none"
                    value={selectedDomain}
                    onChange={e => setSelectedDomain(e.target.value)}
                  >
                    <option value="">Select a domain</option>
                    {domainNames.map((domain: any, index: any) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="my-4">
              <label className="text-slate-300 text-md">Where should we forward the emails?</label>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={faReply} className="mr-3 text-gray-400" />
                <div className="flex w-full rounded overflow-hidden">
                  <select
                    className="bg-slate-950 text-white p-2 w-full focus:outline-none focus:border-transparent appearance-none"
                    value={gotoOption}
                    onChange={e => setGotoOption(e.target.value)}
                  >
                    <option value="">Select a goto</option>
                    <option value="custom">Enter custom address</option>
                    {gotos.map((goto: any, index: any) => (
                      <option key={index} value={goto}>
                        {goto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {gotoOption === "custom" && (
                <div className="mt-2 flex items-center">
                  <FontAwesomeIcon icon={faReply} className="mr-3 text-gray-400" />
                  <input
                    type="email"
                    className="bg-slate-950 text-slate-300 rounded p-2 pr-7 w-full focus:outline-none focus:border-transparent"
                    placeholder="Enter custom address"
                    value={customGoto}
                    onChange={e => {setCustomGoto(e.target.value);}}
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                onClick={closeModal}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={addAliasLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
              >
                {addAliasLoading && (
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="animate-spin mr-2"
                  />
                )}
                Add
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
  );
};

export default AddAliasDialog;
