import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 safe-area-top">
      <div className="max-w-7xl mx-auto pl-2 sm:pl-4 md:pl-6 pr-0 flex items-center justify-between h-8 md:h-10">
        {/* Logo - Centered */}
        <div className="flex-1" />
        <Link
          to="/"
          className="text-sm sm:text-base md:text-lg font-semibold tracking-[0.15em] truncate max-w-[200px] sm:max-w-none"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
          aria-label="Walker's Odyssey home"
        >
          WALKER'S ODYSSEY
        </Link>
        <div className="flex-1 flex justify-end items-center -mr-1">
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