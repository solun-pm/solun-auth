import { useEffect, useState } from 'react';
import "../app/globals.css";

const Loader = () => {
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex text-center items-center justify-center animate-gradient-x"> transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src="https://cdn.solun.pm/images/logo/solun-logo.png"
        className="animate-pulse w-20 h-20"
        alt="Logo"
      />
    </div>
  );
};

export default Loader;