import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

export default function WOCommuneSlate() {
  return (
    <div className="bg-white border-b border-[#2C5F50] safe-area-x">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 flex items-center justify-between h-8 md:h-10 relative">
        {/* Get Help */}
        <Link
          to="/get-help"
          className="font-medium text-xs sm:text-sm text-[#333] hover:text-[#2C5F50] transition-colors whitespace-nowrap"
        >
          Get Help
        </Link>

        {/* Center Text - Responsive positioning */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center px-2">
          <span className="font-semibold text-xs sm:text-sm tracking-wider text-[#333] block sm:inline">
            WO COMMUNE
          </span>
          <span className="text-xs sm:text-sm text-gray-600 ml-0 sm:ml-1 block sm:inline">
            <span className="hidden sm:inline">– </span>Connecting walkers with helpanions
          </span>
        </div>

        {/* Social Icons - Responsive sizing */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a 
            href="https://www.linkedin.com/showcase/wo-commune" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune LinkedIn"
          >
            <Linkedin size={10} className="sm:w-3 sm:h-3" />
          </a>
          <a 
            href="https://www.instagram.com/wo_commune" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune Instagram"
          >
            <Instagram size={10} className="sm:w-3 sm:h-3" />
          </a>
          <a 
            href="https://wocommune.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune Substack"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}