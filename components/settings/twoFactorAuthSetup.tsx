import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faKey } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react";
import { totp } from "otplib";
import { KeyEncodings } from "otplib/core";
import { generate2FASecretKey, encryptAuthPM } from "solun-general-package";
import toast from "react-hot-toast";
const base32Decode = require("base32-decode");

function TwoFactorAuthentication({ userDetails, userInfo }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [enableTwoFA, setEnableTwoFA] = useState(false);
  const [publicTotpSecret, setPublicTotpSecret] = useState("");
  const [otpAuthUrl, setOtpAuthUrl] = useState("");
  const [password, setPassword] = useState("");
  const [twoFaToken, setTwoFaToken] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (userDetails.two_fa) {
      setEnableTwoFA(true);
    } else {
      setEnableTwoFA(false);
    }
  }, [userDetails]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const generateSecret = () => {
    const secret = generate2FASecretKey() as any;
    const hexSecret = Buffer.from(base32Decode(secret, "RFC4648")).toString(
      "hex"
    );
    setTotpSecret(hexSecret);
    setPublicTotpSecret(secret);

    const issuer = "Solun";
    const account = userDetails.fqe;

    const otpAuth = totp.keyuri(account, issuer, secret);
    setOtpAuthUrl(otpAuth);
  };

  const verifyToken = async () => {
    totp.options = { encoding: KeyEncodings.HEX };

    const isValid = totp.verify({ token: twoFaToken, secret: totpSecret });

    if (isValid) {
      setEnableTwoFA(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/two_factor/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userInfo.user_id,
          secret: await encryptAuthPM(publicTotpSecret, password),
          token: localStorage.getItem("jwt"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      onCancel();
      return;
    } else {
      toast.error("Invalid token");
      return;
    }
  };

  const disable2FA = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/two_factor/disable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.user_id,
        token: localStorage.getItem("jwt"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    setTotpSecret("");
    setOtpAuthUrl("");
    setEnableTwoFA(false);
    return;
  };

  const enable2FA = async () => {
    openModal();
  };

  const checkPasswordAndProceed = async () => {
    const isPasswordValid = await validate2FAPassword();
    if (isPasswordValid) {
      setIsPasswordChecked(true);
      generateSecret();
    }
  };

  const validate2FAPassword = async () => {
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

  const onCancel = async () => {
    closeModal();
    setIsPasswordChecked(false);
    setPassword("");
    setTwoFaToken("");
    setTotpSecret("");
    setOtpAuthUrl("");
    setPublicTotpSecret("");
  };

  return (
    <div className="bg-slate-900 p-5 rounded-lg shadow-md max-w-lg mt-4">
      <h2 className="text-xl font-bold mb-2">Two-Factor Authentication</h2>
      <p className="text-gray-300 mb-4">
        Two-factor authentication adds an extra layer of security to your
        account. Once enabled, you will be prompted to enter a code from your
        authenticator app when logging in.
      </p>
      {!enableTwoFA ? (
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={enable2FA}
          >
            Enable
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
            onClick={disable2FA}
          >
            Disable
          </button>
        </div>
      )}
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={isOpen}
          onClose={() => null}
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
                {!isPasswordChecked ? (
                  <>
                    <div className="mb-4">
                      <h1 className="text-white text-2xl">
                        Enable Two-Factor Authentication
                      </h1>
                      <p className="text-slate-300 text-md mb-4">
                        Enter your password to start the 2FA setup process
                      </p>
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="mr-3 text-gray-400"
                        />
                        <input
                          type="password"
                          name="password"
                          className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                        onClick={onCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                        onClick={checkPasswordAndProceed}
                      >
                        Proceed
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap justify-center items-center">
                      <h1 className="text-white text-2xl">
                        Scan the QR code below
                      </h1>
                      <p className="text-slate-300 text-sm mb-2">
                        or use the secret key to setup your 2FA
                      </p>
                      <div className="mt-4">
                        <QRCode value={otpAuthUrl} size={200} />
                      </div>
                      <p className="text-white font-mono text-sm mt-2 mb-4">
                        {publicTotpSecret}
                      </p>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="mr-3 text-gray-400"
                        />
                        <input
                          type="text"
                          name="token"
                          className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          placeholder="Enter your token"
                          onChange={(e) => setTwoFaToken(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                        onClick={onCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                        onClick={verifyToken}
                      >
                        Activate
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default TwoFactorAuthentication;
