import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

export default function WOCommuneSlate() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        {/* Get Help */}
        <Link
          to="/get-help"
          className="font-medium text-sm text-[#333] hover:text-[#2C5F50] transition-colors"
        >
          Get Help
        </Link>

        {/* Center Text */}
        <div className="text-center">
          <span className="font-semibold text-sm tracking-wider text-[#333]">
            WO COMMUNE
          </span>
          <span className="text-sm text-gray-600 ml-2">
            – Connecting walkers with helpanions
          </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2">
          <a 
            href="https://www.linkedin.com/showcase/wo-commune" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune LinkedIn"
          >
            <Linkedin size={14} />
          </a>
          <a 
            href="https://www.instagram.com/wo_commune" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune Instagram"
          >
            <Instagram size={14} />
          </a>
          <a 
            href="https://wocommune.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#2C5F50] hover:bg-gray-200 transition-colors"
            aria-label="WO Commune Substack"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.539 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}