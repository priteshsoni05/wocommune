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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      {/* Burger Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
        aria-label="Menu"
      >
        <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="absolute top-full right-0 mt-2 w-64 bg-white shadow-2xl z-50 rounded-lg border border-gray-200 animate-fade-in"
            style={{ transformOrigin: 'top right' }}
          >
            {/* Close Button */}
            <div className="flex justify-end p-2 border-b border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="inline-flex w-6 h-6 items-center justify-center text-gray-400 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wo-commune"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    WO COMMUNE
                  </Link>
                </li>
                <li>
                  <Link
                    to="/helpanions"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    Meet your Helpanion
                  </Link>
                </li>
              </ul>

              {/* Divider */}
              <hr className="my-3 border-gray-200" />

              {/* Auth Section */}
              {user ? (
                <div>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    {avatarContent.type === 'image' ? (
                      <img
                        src={avatarContent.value}
                        alt={`${displayName} avatar`}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: "#193232" }}>
                        {avatarContent.value}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium text-gray-900">Hi {displayName}</div>
                    </div>
                  </div>

                  {/* User Actions */}
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to={dashboardPath}
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
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
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/auth?mode=signup"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-white rounded-md transition-all duration-200 font-medium" 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#193232"} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
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