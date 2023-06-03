import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/login');
  };

  return (
    <>
    <nav className="flex justify-start bg-slate-950 p-4 mb-4 rounded-lg shadow-xl">
      <Link href="/dashboard" className={`mr-4 text-white font-bold py-2 px-4 rounded transition-all ${pathname === '/dashboard' ? 'bg-blue-500' : 'hover:bg-blue-500'}`}>
          Overview
      </Link>
      <Link href="/dashboard#2" className={`text-white font-bold py-2 px-4 rounded transition-all ${pathname === '/dashboard#2' ? 'bg-blue-500' : 'hover:bg-blue-500'}`}>
          Settings
      </Link>
      <Link onClick={handleLogout} href="#" className="ml-auto text-white font-bold py-2 px-4 rounded transition-all hover:bg-blue-500">
        Logout
    </Link>
    </nav>
    </>
  );
};

export default Navigation;