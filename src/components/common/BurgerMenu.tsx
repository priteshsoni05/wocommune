import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BurgerMenuProps {
  user: any;
  displayName: string;
  avatarContent: { type: 'image' | 'initial'; value: string };
  dashboardPath: string;
  clearRoleData: () => void;
  signOut: () => Promise<void>;
  navigate: (path: string) => void;
}

export default function BurgerMenu({ 
  user, 
  displayName, 
  avatarContent, 
  dashboardPath, 
  clearRoleData, 
  signOut, 
  navigate 
}: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    clearRoleData();
    await signOut();
    navigate('/wo-commune');
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile/Desktop Slide-in Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40" />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 max-w-[80vw] shadow-xl z-50 flex flex-col" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{ backgroundColor: '#ffffff' }}>
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4" style={{ backgroundColor: '#ffffff' }}>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wo-commune"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                  >
                    WO COMMUNE
                  </Link>
                </li>
                <li>
                  <span className="block px-3 py-2 text-gray-400 cursor-not-allowed">
                    Shop
                  </span>
                </li>
              </ul>

              {/* Divider */}
              <hr className="my-4 border-gray-200" />

              {/* Auth Section */}
              {user ? (
                <div>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    {avatarContent.type === 'image' ? (
                      <img
                        src={avatarContent.value}
                        alt={`${displayName} avatar`}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2C5F50] flex items-center justify-center text-white text-sm font-semibold">
                        {avatarContent.value}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">Hi {displayName}</div>
                    </div>
                  </div>

                  {/* User Actions */}
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to={dashboardPath}
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/auth?mode=login"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/auth?mode=signup"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-[#2C5F50] hover:text-white rounded-md transition-all duration-200 font-medium"
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}