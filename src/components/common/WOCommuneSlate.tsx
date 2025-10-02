import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { GetHelpDropdown } from '@/components/helpanion/GetHelpDropdown';

export default function WOCommuneSlate() {
  return (
    <div className="fixed top-[36px] md:top-[44px] left-0 right-0 z-40 safe-area-x" style={{ backgroundColor: "#193232", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 flex items-center justify-between h-14 relative">

        {/* Left section - Get Help Dropdown */}
        <div className="flex-1">
          <GetHelpDropdown />
        </div>
        
        {/* Center Text - WO COMMUNE only */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="font-logo text-sm sm:text-base tracking-wider" style={{ color: "hsl(40, 20%, 98%)" }}>
            WO COMMUNE
          </span>
        </div>
        
        {/* Right section - matches logo layout */}
        <div className="flex-1 flex justify-end items-center">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <a
              href="https://www.linkedin.com/showcase/wo-commune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center leading-none transition-colors" 
              style={{ color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune LinkedIn"
            >
              <Linkedin className="block w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="https://www.instagram.com/wo_commune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center leading-none transition-colors" 
              style={{ color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Instagram"
            >
              <Instagram className="block w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center leading-none transition-colors" 
              style={{ color: "hsl(40, 20%, 98%)" }} 
              onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }} 
              onMouseLeave={(e) => { e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Substack"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="block w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}