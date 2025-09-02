import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

export default function WOCommuneSlate() {
  console.log('WOCommuneSlate is rendering');
  return (
    <div className="safe-area-x" style={{ backgroundColor: "#193232", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", minHeight: "40px" }}>
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 flex items-center justify-between h-8 md:h-10">
        {/* Left section - matches logo layout */}
        <div className="flex-1">
          <Link
            to="/get-help"
            className="font-medium text-xs sm:text-sm transition-colors whitespace-nowrap" style={{ color: "hsl(40, 20%, 98%)" }} onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)"} onMouseLeave={(e) => e.currentTarget.style.color = "hsl(40, 20%, 98%)"}
          >
            Get Help
          </Link>
        </div>
        
        {/* Center Text - Exactly aligned with logo */}
        <div className="text-center">
          <span className="font-semibold text-xs sm:text-sm tracking-wider block sm:inline" style={{ color: "hsl(40, 20%, 98%)" }}>
            WO COMMUNE
          </span>
          <span className="text-xs sm:text-sm ml-0 sm:ml-1 block sm:inline" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            <span className="hidden sm:inline">– </span>Connecting walkers with helpanions
          </span>
        </div>
        
        {/* Right section - matches logo layout */}
        <div className="flex-1 flex justify-end items-center">
          <div className="flex items-center gap-1 sm:gap-2 -mr-2 sm:-mr-3">
            <a 
              href="https://www.linkedin.com/showcase/wo-commune" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune LinkedIn"
            >
              <Linkedin size={10} className="sm:w-3 sm:h-3" />
            </a>
            <a 
              href="https://www.instagram.com/wo_commune" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Instagram"
            >
              <Instagram size={10} className="sm:w-3 sm:h-3" />
            </a>
            <a 
              href="https://wocommune.substack.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "hsl(40, 20%, 98%)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.color = "hsl(40, 20%, 98%)"; }}
              aria-label="WO Commune Substack"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}