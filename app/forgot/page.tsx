"use client";

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faCircleNotch,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import RecoveryModal from "@/components/recoveryModal";
import { generateRecoveryCode, hashPassword } from "solun-general-package";

const { version } = require("../../package.json");

const LoginPage = () => {
  const router = useRouter();

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
  const [code, setCode] = useState("");
  const [codeVisible, setCodeVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

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

  const [formData, setFormData] = useState({
    fqe: "",
    code: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeVisibility = () => {
    setCodeVisible(!codeVisible);
  };

  const handleCodeChange = (event : any) => {
    setCode(event.target.value);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const isValidPasswordForm = () => {
    return password && confirmPassword && password === confirmPassword;
  };

  const isValidForm = () => {
    return formData.fqe && code;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (!isValidForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/check_recovery_code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fqe: formData.fqe,
          recoveryCode: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      if(!data.correct) {
        toast.error(data.message);
        return;
      }
      
      setIsSubmitting(false);
      setSuccess(true);
    } catch (error) {
      toast.error("Something went wrong");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);

    const recovery = generateRecoveryCode();
    setRecoveryCode(recovery);
    const recoveryCodeHash = await hashPassword(recoveryCode);

    const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fqe: formData.fqe,
        password: password,
        confirmPassword: confirmPassword,
        oldRecoveryCode: code,
        newRecoveryCode: recoveryCodeHash,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setShowRecoveryModal(true);
    toast.success("Password successfully resetted");
  };

  const closeRecoveryModal = () => {
    setShowRecoveryModal(false);
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center py-8 px-2 min-h-screen animate-gradient-x">
      <Toaster position="top-right" />
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        {!success ? (
          <p className="mb-5">Forgot your password? No problem! Enter your account mail address and your recovery code to reset your password.
          <br/>
          Warning: This will disable your 2FA if you have it enabled, also this action will create a new private and public key for your account.</p>
        ) : (
          <p className="mb-5">Please enter your new password and confirm it.
          <br/>
          After that you will get a new recovery code. Please save it somewhere safe.</p>
        )}
        {!success ? (
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
                type={codeVisible ? "text" : "password"}
                name="code"
                onChange={handleCodeChange}
                className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Recovery Code"
              />
              {code.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                  <FontAwesomeIcon
                    icon={codeVisible ? faEyeSlash : faEye}
                    className="cursor-pointer"
                    onClick={handleCodeVisibility}
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
            Reset Password
          </button>
        </form>
        ) : (
          <form onSubmit={resetPassword} autoComplete="off">
            <div className="mb-4 mt-4">
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  onChange={handlePasswordChange}
                  className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New Password"
                />
                {code.length > 0 && (
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
            <div className="mb-4 mt-4">
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400" />
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  className="bg-slate-950 text-white w-full p-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm Password"
                />
                {code.length > 0 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-300 cursor-pointer hover:text-blue-500">
                    <FontAwesomeIcon
                      icon={confirmPasswordVisible ? faEyeSlash : faEye}
                      className="cursor-pointer"
                      onClick={handleConfirmPasswordVisibility}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-3 rounded transition duration-200 flex justify-center items-center"
              disabled={!isValidPasswordForm() || isSubmitting}
            >
              {isSubmitting && (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin mr-2"
                />
              )}
              Set new Password
            </button>
          </form>
        )}
        <div className="mt-5 text-center">
          <p>
            Go back to{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </a>
          </p>
          <hr className="mt-4 h-px border-0 bg-gray-500" />
          <p className="text-sm mt-4 text-slate-400">
            Solun Auth {version}
          </p>
        </div>
      </div>
      {showRecoveryModal && (
        <RecoveryModal showRecoveryModal={showRecoveryModal} recoveryCode={recoveryCode} closeRecoveryModal={closeRecoveryModal} />
    )}
    </div>
  );
};

export default LoginPage;