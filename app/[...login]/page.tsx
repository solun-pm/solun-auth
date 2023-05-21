"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const LoginPage = ({ params }: { params: { login: string[] } }) => {
  const redirectService = params.login[1];
  const [serviceProvider, setServiceProvider] = useState('');

  useEffect(() => {
    if(redirectService === 'mail') {
      setServiceProvider('Mail');  
    }
  }, [redirectService]);

  const [formData, setFormData] = useState({
    fqe: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  }

  const isValidForm = () => {
    return formData.fqe && formData.password;
  }  

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsSubmitting(true);
  
    if (!isValidForm()) {
      alert('Please fill in all fields correctly.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fqe: formData.fqe,
          password: formData.password,
          service: serviceProvider,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      localStorage.setItem('jwt', data.token);
      alert('Logged in successfully.');

    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8 px-2 min-h-screen animate-gradient-x">
      <div className="bg-slate-800 text-white p-5 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        {redirectService === 'mail' ?
          <p className="mb-4">Welcome back! Please login to continue to your {serviceProvider} account.</p>
        :
          <p className="mb-5">Welcome back! Please login to continue.</p>
        }
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400"/>
            <input 
              type="text" 
              name="fqe" 
              onChange={handleChange} 
              className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="E-Mail Address"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-3 text-gray-400"/>
              <input 
                type="password" 
                name="password" 
                onChange={handleChange} 
                className="bg-slate-950 text-white w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Password"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-3 rounded transition duration-200 flex justify-center items-center"
            disabled={!isValidForm() || isSubmitting}
          >
            {isSubmitting && 
              <FontAwesomeIcon 
                icon={faCircleNotch} 
                className="animate-spin mr-2"
              />
            }
            Login
          </button>
        </form>
        <div className="mt-5 text-center">
          <p className="mb-4">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-600">Register</a></p>
          <hr className="h-px border-0 bg-gray-500" />
          <p className="text-sm mt-4 text-slate-400">By logging in, you agree to our <a href="https://solun.pm/terms" className="text-blue-500 hover:text-blue-600">Terms of Service</a> and <a href="https://solun.pm/privacy" className="text-blue-500 hover:text-blue-600">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;