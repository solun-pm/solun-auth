"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faCircleNotch,
  faKey,
  faTimes,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";

const { version } = require("../../package.json");

const LoginPage = ({ params }: { params: { login: string[] } }) => {
  const router = useRouter();

  const redirectService = params.login[1];
  const [serviceProvider, setServiceProvider] = useState("");

  // TODO: Move this to a config file.
  const domains = [
    "@solun.pm",
    "@6crypt.com",
    "@seal.pm",
    "@xolus.de",
    "@cipher.pm",
  ];

  const [suggestedDomain, setSuggestedDomain] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailInputRef = useRef(null);

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, fqe: value });
    const atIndex = value.indexOf("@");

    if (atIndex !== -1) {
      const inputDomain = value.slice(atIndex);

      const matchedDomain = domains.find((domain) =>
        domain.startsWith(inputDomain)
      );
      if (matchedDomain) {
        setSuggestedDomain(matchedDomain);
        setShowSuggestion(true);
      } else {
        setShowSuggestion(false);
      }
    } else {
      setShowSuggestion(false);
    }
  };

  const applySuggestedDomain = () => {
    if (emailInputRef.current) {
      const newValue = formData.fqe.split("@")[0] + suggestedDomain;
      setFormData({ ...formData, fqe: newValue });
      setShowSuggestion(false);
    }
  };

  useEffect(() => {
    if (redirectService === "mail") {
      setServiceProvider("Mail");
    }
  }, [redirectService]);

  const [formData, setFormData] = useState({
    fqe: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (event : any) => {
    setPassword(event.target.value);
  };

  const isValidForm = () => {
    return formData.fqe && password;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!isValidForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fqe: formData.fqe,
          password: password,
          service: serviceProvider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      if (data.two_fa) {
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      if (data.redirect) {
        if (data.service === "Mail") {
          router.push(data.redirectUrl)
        }
      } else {
        toast.success("Login successful!");
        localStorage.setItem("jwt", data.token);
        router.push("/dash/overview");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTwoFACodeChange = (e: any) => {
    setTwoFACode(e.target.value);
  };

  const handle2FASubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/two_factor/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fqe: formData.fqe,
          twoFACode,
          password: password,
          service: serviceProvider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        setIsSubmitting(false);
        return;
      }

      if (data.redirect) {
        if (data.service === "Mail") {
          router.push(data.redirectUrl)
        }
      } else {
        toast.success("Login successful!");
        localStorage.setItem("jwt", data.token);
        router.push("/dash/overview");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8 px-2 min-h-screen animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-md">
        {showModal && (
          <Transition appear show={showModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => setShowModal(false)}
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
                      className="text-lg font-medium leading-6 text-white"
                    >
                      This account is secured by a Two-Factor-Authenticator
                    </Dialog.Title>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faKey}
                          className="mr-3 text-gray-400"
                        />
                        <input
                          type="text"
                          name="twoFACode"
                          onChange={handleTwoFACodeChange}
                          className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your 2FA Code here"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-3 py-3 rounded transition duration-200 mr-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-3 rounded transition duration-200"
                        onClick={handle2FASubmit}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        )}
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        {redirectService === "mail" ? (
          <p className="mb-4">
            Welcome back! Please login to continue to your {serviceProvider}{" "}
            account.
          </p>
        ) : (
          <p className="mb-5">Welcome back! Please login to continue.</p>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-1 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
            <input
              type="text"
              name="fqe"
              onChange={handleEmailChange}
              className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="E-Mail Address"
              ref={emailInputRef}
              value={formData.fqe}
            />
          </div>
          {showSuggestion && (
            <div
              className="text-gray-400 text-xs cursor-pointer ml-7 mb-2"
              onClick={applySuggestedDomain}
            >
              Do you mean:{" "}
              <span className="text-blue-500">
                {formData.fqe.split("@")[0] + suggestedDomain}
              </span>
              ?
            </div>
          )}
          <div className="mb-4 mt-4">
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                onChange={handlePasswordChange}
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
              />
              {password.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="cursor-pointer"
                    onClick={handlePasswordVisibility}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-3 rounded transition duration-200 flex justify-center items-center"
            disabled={!isValidForm() || isSubmitting}
          >
            {isSubmitting && (
              <FontAwesomeIcon
                icon={faCircleNotch}
                className="animate-spin mr-2"
              />
            )}
            Login
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-600">
              Register
            </a>
          </p>
          <hr className="h-px border-0 bg-gray-500" />
          <p className="text-sm mt-4 text-slate-400">
            By logging in, you agree to our{" "}
            <a
              href={process.env.NEXT_PUBLIC_MAIN_DOMAIN + "/tos"}
              className="text-blue-500 hover:text-blue-600"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href={process.env.NEXT_PUBLIC_MAIN_DOMAIN + "/privacy"}
              className="text-blue-500 hover:text-blue-600"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-sm mt-4 text-slate-400">
            Solun Auth {version}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
