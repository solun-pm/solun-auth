"use client";

import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faCircleNotch,
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FriendlyCaptcha } from "@/components/captcha";
import { Dialog, Transition } from "@headlessui/react";
import { hashPassword, generateRecoveryCode } from "solun-general-package";

const { version } = require("../../package.json");

const RegisterPage = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  const [formData, setFormData] = useState({
    username: "",
    domain: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState("idle");
  const [exists, setExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [solution, setSolution] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

  useEffect(() => {
    let timer: any;
    if (formData.username && formData.domain) {
      setStatus("loading");
      timer = setTimeout(async () => {
        await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            domain: formData.domain,
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
  }, [formData.username, formData.domain]);

  const handleChange = (e: any) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });

    // Set status back to 'idle' only when username or domain is changed.
    if (name === "username" || name === "domain") {
      setStatus("idle");
    }
  };

  const isValidForm = () => {
    const trimmedUsername = formData.username.replace(/\s/g, "");
    const specialCharsRegex = /^[a-zA-Z0-9_.-]+$/;

    return (
      trimmedUsername !== "" &&
      specialCharsRegex.test(trimmedUsername) &&
      formData.domain &&
      formData.domain !== "Select domain..." &&
      password &&
      passwordConfirm &&
      status === "resolved" &&
      !exists
    );
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const handlePasswordChange = (event : any) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event : any) => {
    setPasswordConfirm(event.target.value);
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!isValidForm()) {
      toast.error("Please fill out all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    const recovery = generateRecoveryCode();
    setRecoveryCode(recovery);
    const recoveryCodeHash = await hashPassword(recoveryCode);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.replace(/\s/g, ""),
          domain: formData.domain,
          password: password,
          confirmPassword: passwordConfirm,
          solution: solution,
          recoveryCode: recoveryCodeHash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        setIsSubmitting(false);
        return;
      }

      setStatus("resolved");
      setShowRecoveryModal(true);
      //alert('User registered successfully.');
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: Move to config file.
  const domains = [
    "@solun.pm",
    "@6crypt.com",
    "@seal.pm",
    "@xolus.de",
    "@cipher.pm",
  ];

  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    goToLogin();
  };

  return (
    <div className="flex items-center justify-center py-8 px-2 min-h-screen animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Register</h1>
        <p className="mb-5">
          You're just a few steps away from your new Solun account.
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
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
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
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
                onChange={handleChange}
                className="bg-slate-950 p-2 w-1/2 focus:outline-none focus:border-transparent appearance-none"
              >
                <option value="">Select domain...</option>
                {domains.map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
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
          <div className="mb-4">
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
              <input
                type={passwordConfirmVisible ? "text" : "password"}
                name="confirmPassword"
                onChange={handlePasswordConfirmChange}
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm Password"
              />
              {passwordConfirm.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={passwordConfirmVisible ? faEyeSlash : faEye}
                    className="cursor-pointer"
                    onClick={handlePasswordConfirmVisibility}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <FriendlyCaptcha setDisabled={setDisabled} setSolution={setSolution} />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-3 rounded transition duration-200 flex justify-center items-center"
            disabled={!isValidForm() || isSubmitting || disabled}
          >
            {isSubmitting && (
              <FontAwesomeIcon
                icon={faCircleNotch}
                className="animate-spin mr-2"
              />
            )}
            Create Account
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </a>
          </p>
          <hr className="h-px border-0 bg-gray-500" />
          <p className="text-sm mt-4 text-slate-400">
            With your registration you agree to our{" "}
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
      {showRecoveryModal && (
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
    )}
    </div>
  );
};

export default RegisterPage;
