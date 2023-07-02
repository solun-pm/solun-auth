import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const RecoveryModal = ({ showRecoveryModal, recoveryCode, closeRecoveryModal }: any) => {
  return (
    <Transition appear show={showRecoveryModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => null}
      >
        <div className="min-h-screen px-4 text-center">
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
              <Dialog.Title
                as="h3"
                className="text-xl font-medium leading-6 text-white"
              >
                Your recovery code
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-slate-300">
                  Write down this recovery code. With this key, you can reset your account password and your 2FA status, if applicable.
                </p>
                <p className="bg-slate-800 rounded p-4 mt-4 font-extrabold text-white break-all">{recoveryCode}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  onClick={() => closeRecoveryModal()}
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

export default RecoveryModal;