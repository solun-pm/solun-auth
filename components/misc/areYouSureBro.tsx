import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const AreYouSureBro = ({ isOpen, closeModal, buttonAction }: any) => {
  const cancelButtonRef = useRef(null);

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
              <div className="my-4">
                <h1 className="text-white text-2xl">Do you really want to take this action?</h1>
                <p className="text-slate-300 text-md mt-2 mb-4 break-words">
                    This action cannot be undone.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mt-4 mr-2"
                    onClick={() => buttonAction(false) && closeModal()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => buttonAction(true)}
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </div>
          </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );  
};

export default AreYouSureBro;