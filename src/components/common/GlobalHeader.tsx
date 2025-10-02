import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';

interface GlobalHeaderProps {
  user?: any;
  displayName?: string;
  avatarContent?: { type: 'image' | 'initial'; value: string };
  dashboardPath?: string;
  clearRoleData?: () => void;
  signOut?: () => Promise<void>;
  navigate?: (path: string) => void;
}

export default function GlobalHeader({ 
  user, 
  displayName, 
  avatarContent, 
  dashboardPath, 
  clearRoleData, 
  signOut, 
  navigate 
}: GlobalHeaderProps) {
  const location = useLocation();
  const onWOCommune = location.pathname.startsWith('/wo-commune');
  const containerPaddingClass = 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14';
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white safe-area-top ${onWOCommune ? '' : 'border-b border-gray-200'}`}>
      <div className={`w-full ${containerPaddingClass} flex items-center justify-between h-9 md:h-11`}>
        {/* Logo - Centered */}
        <div className="flex-1" />
        <Link
          to="/"
          className="text-sm sm:text-base md:text-lg font-logo font-semibold tracking-[0.15em] truncate max-w-[200px] sm:max-w-none"
          style={{ color: "#333" }}
          aria-label="Walker's Odyssey home"
        >
          WALKER'S ODYSSEY
        </Link>
        <div className="flex-1 flex justify-end items-center">
          <BurgerMenu 
            user={user} 
            displayName={displayName || "Friend"} 
            avatarContent={avatarContent || { type: 'initial', value: 'U' }} 
            dashboardPath={dashboardPath || "/wo-commune"} 
            clearRoleData={clearRoleData || (() => {})} 
            signOut={signOut || (() => Promise.resolve())} 
            navigate={navigate || (() => {})} 
          />
        </div>
      </div>
    </header>
  );
}