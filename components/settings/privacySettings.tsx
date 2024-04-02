import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { decryptAuthPM } from "solun-general-package";

const PublicKeyModal = ({ isOpen, onClose, onDownload }: any) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={onClose}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
          <div className="inline-block align-bottom bg-slate-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <Dialog.Title as="h3" className="text-2xl leading-6 text-white">
              Download Public Key
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-md mb-2 text-slate-300">
                Download your Public key and share it with your contacts, so
                they can send you encrypted emails.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                onClick={onDownload}
              >
                Download
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

const PrivateKeyModal = ({
  isOpen,
  onClose,
  onValidate,
  password,
  setPassword,
}: any) => (
  <Transition show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      open={isOpen}
      onClose={onClose}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
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
          <div className="inline-block align-bottom bg-slate-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <Dialog.Title as="h3" className="text-2xl leading-6 text-white">
              Download Private Key
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-md mb-2 text-slate-300">
                Please enter your password to download your Private key which is
                used to decrypt your emails.
              </p>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                onClick={onValidate}
              >
                Proceed
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

function PrivacySettings({ userDetails, userInfo }: any) {
  const [isPublicKeyOpen, setIsPublicKeyOpen] = useState(false);
  const [isPrivateKeyOpen, setIsPrivateKeyOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [fastLogin, setFastLogin] = useState(false);
  const [fastLoginLoading, setFastLoginLoading] = useState(false);
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [betaFeaturesLoading, setBetaFeaturesLoading] = useState(false);

  useEffect(() => {
    if (userDetails.fast_login) {
      setFastLogin(true);
    } else {
      setFastLogin(false);
    }
    if (userDetails.beta) {
      setBetaFeatures(true);
    } else {
      setBetaFeatures(false);
    }
  }, [userDetails]);

  const validatePassword = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/validate_pwd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        password: password,
        token: localStorage.getItem("jwt"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return false;
    }

    return true;
  };

  const downloadPublicKey = async () => {
    const key = userDetails.public_key;
    setIsPublicKeyOpen(false);

    const element = document.createElement("a");
    const file = new Blob([key], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "publickey." + userInfo.fqe + ".asc";
    document.body.appendChild(element);
    element.click();

    toast.success("Public key downloaded successfully.");

    setTimeout(function () {
      document.body.removeChild(element);
    }, 100);
  };

  const downloadPrivateKey = async () => {
    if (await validatePassword()) {
      const key = userDetails.private_key;
      // Encrypt private key with password
      const decryptedKey = decryptAuthPM(key, password);
      setIsPrivateKeyOpen(false);

      const element = document.createElement("a");
      const file = new Blob([decryptedKey], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "privatekey." + userInfo.fqe + ".asc";
      document.body.appendChild(element);
      element.click();

      toast.success("Private key downloaded successfully.");
      setPassword("");

      setTimeout(function () {
        document.body.removeChild(element);
      }, 100);
    }
  };

  const toggleFastLogin = async () => {
    setFastLoginLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/fast_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        fast_login: !fastLogin,
        token: localStorage.getItem("jwt"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      setFastLoginLoading(false);
      return;
    }

    setFastLoginLoading(false);
    setFastLogin(!fastLogin);
    toast.success(data.message);
  };

  const toggleBetaFeatures = async () => {
    setBetaFeaturesLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/beta_features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        beta_features: !betaFeatures,
        token: localStorage.getItem("jwt"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setBetaFeaturesLoading(false);
      toast.error(data.message);
      return;
    }

    setBetaFeaturesLoading(false);
    setBetaFeatures(!betaFeatures);
    toast.success(data.message);
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Privacy Settings</h2>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Mail Encryption</h3>
        <p className="text-md mb-4 text-slate-300">
          You can download your public and private keys here. Your public key is
          used to encrypt your emails, and your private key is used to decrypt
          them.
        </p>
        <div className="flex justify-between gap-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={() => setIsPublicKeyOpen(true)}
          >
            Download Public Key
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={() => setIsPrivateKeyOpen(true)}
          >
            Download Private Key
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Fast Login</h3>
        <p className="text-md mb-4 text-slate-300">
          You can enable Fast Login to skip the password prompt when logging
          into other Solun services.
        </p>
        <div className="flex justify-between gap-4">
          {!fastLogin ? (
            <button
              type="button"
              onClick={toggleFastLogin}
              disabled={fastLoginLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {fastLoginLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Enable
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleFastLogin}
              disabled={fastLoginLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {fastLoginLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Disable
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Beta Features</h3>
        <p className="text-md mb-4 text-slate-300">
          You can enable beta features to test out new features before they are
          released to the production environment. This option is also called
          "Public Beta".
        </p>
        <div className="flex justify-between gap-4">
          {!betaFeatures ? (
            <button
              type="button"
              onClick={toggleBetaFeatures}
              disabled={betaFeaturesLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {betaFeaturesLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Enable
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleBetaFeatures}
              disabled={betaFeaturesLoading}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            >
              {betaFeaturesLoading && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Disable
            </button>
          )}
        </div>
      </div>

      <PublicKeyModal
        isOpen={isPublicKeyOpen}
        onClose={() => setIsPublicKeyOpen(false)}
        onDownload={downloadPublicKey}
      />
      <PrivateKeyModal
        isOpen={isPrivateKeyOpen}
        onClose={() => setIsPrivateKeyOpen(false)}
        onValidate={downloadPrivateKey}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
}

export default PrivacySettings;
